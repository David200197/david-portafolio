#!/usr/bin/env node

import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de optimización
const CONFIG = {
  // Calidades
  webpQuality: 80,
  jpegQuality: 85,
  pngCompression: 9, // 0-9
  
  // Patrones de búsqueda
  patterns: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.JPG', '**/*.JPEG', '**/*.PNG'],
  
  // Excluir directorios
  exclude: [
    '**/node_modules/**',
    '**/.git/**',
    '**/olds/**',     // Excluir la carpeta de backups
    '**/*.webp',
    '**/package.json',
    '**/package-lock.json',
    '**/*.config.*',
  ],
  
  // Directorio base
  baseDir: 'public',
  
  // Backup de originales
  backupOriginal: true,
  backupDir: 'public/olds',  // Nueva carpeta para originales
  
  // Tamaños para WebP
  generateWebpCopies: true,
  webpSizes: [320, 640, 768, 1024, 1280, 1536, 1920],
  
  // Eliminar originales después de optimizar (conservar solo WebP)
  removeOriginalsAfterOptimization: false,
  
  // Fecha en nombre de backup
  timestampBackup: true,
};

// Estadísticas
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
  webpGenerated: 0,
  jpegOptimized: 0,
  pngOptimized: 0,
  backupsCreated: 0,
};

/**
 * Formatea bytes a tamaño legible
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Crea un nombre único para el backup
 */
function getBackupName(filePath, timestamp = false) {
  const parsed = path.parse(filePath);
  const dateStr = timestamp ? `-${Date.now()}` : '';
  
  // Si ya existe un archivo con ese nombre, agregar número
  return `${parsed.name}${dateStr}${parsed.ext}`;
}

/**
 * Copia el archivo original a la carpeta olds manteniendo estructura
 */
async function backupToOlds(filePath) {
  try {
    const relativePath = path.relative(CONFIG.baseDir, filePath);
    const parsed = path.parse(relativePath);
    
    // Crear path en olds manteniendo estructura de directorios
    const backupDir = path.join(CONFIG.backupDir, parsed.dir);
    await fs.mkdir(backupDir, { recursive: true });
    
    // Generar nombre para el backup
    const backupName = getBackupName(filePath, CONFIG.timestampBackup);
    const backupPath = path.join(backupDir, backupName);
    
    // Copiar (no mover) el archivo original
    await fs.copyFile(filePath, backupPath);
    
    stats.backupsCreated++;
    return backupPath;
    
  } catch (error) {
    console.error(`❌ Error copiando a olds: ${filePath}`, error.message);
    throw error;
  }
}

/**
 * Verifica si un archivo existe
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Optimiza una imagen JPEG/PNG desde la ubicación original
 */
async function optimizeImage(filePath, originalSize) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // Leer imagen desde ubicación original
    let image = sharp(filePath);
    const metadata = await image.metadata();
    
    let optimizationConfig = {};
    
    // Determinar configuración por tipo
    if (ext === '.jpg' || ext === '.jpeg') {
      optimizationConfig = {
        quality: CONFIG.jpegQuality,
        mozjpeg: true,
        progressive: true,
        optimizeScans: true,
      };
      stats.jpegOptimized++;
      
    } else if (ext === '.png') {
      optimizationConfig = {
        compressionLevel: CONFIG.pngCompression,
        adaptiveFiltering: true,
        palette: metadata.channels <= 1,
      };
      stats.pngOptimized++;
    }
    
    // Crear un archivo temporal para la optimización
    const tempPath = `${filePath}.temp`;
    
    // Guardar imagen optimizada en temporal
    if (ext === '.jpg' || ext === '.jpeg') {
      await image.jpeg(optimizationConfig).toFile(tempPath);
    } else if (ext === '.png') {
      await image.png(optimizationConfig).toFile(tempPath);
    }
    
    // Reemplazar original con optimizado
    await fs.unlink(filePath); // Eliminar original
    await fs.rename(tempPath, filePath); // Renombrar temporal a original
    
    // Obtener tamaño optimizado
    const optimizedStats = await fs.stat(filePath);
    const optimizedSize = optimizedStats.size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    return {
      success: true,
      optimizedSize,
      reduction,
      type: ext.substring(1).toUpperCase(),
    };
    
  } catch (error) {
    console.error(`❌ Error optimizando ${filePath}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Genera versión WebP
 */
async function generateWebPVersion(sourcePath, size = null) {
  try {
    const parsed = path.parse(sourcePath);
    const sizeSuffix = size ? `-${size}w` : '';
    const webpPath = path.join(parsed.dir, `${parsed.name}${sizeSuffix}.webp`);
    
    let image = sharp(sourcePath);
    
    // Redimensionar si se especifica tamaño
    if (size) {
      const metadata = await image.metadata();
      if (metadata.width > size) {
        image = image.resize({ width: size, withoutEnlargement: true });
      }
    }
    
    // Convertir a WebP
    await image
      .webp({ 
        quality: CONFIG.webpQuality,
        effort: 6,
        lossless: false,
        alphaQuality: 80,
      })
      .toFile(webpPath);
    
    const webpStats = await fs.stat(webpPath);
    stats.webpGenerated++;
    
    return {
      success: true,
      webpPath,
      size: size || 'original',
      webpSize: webpStats.size,
    };
    
  } catch (error) {
    console.error(`❌ Error generando WebP para ${sourcePath}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Procesa una imagen individual
 */
async function processImage(filePath) {
  const relativePath = path.relative(CONFIG.baseDir, filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  console.log(`🔄 Procesando: ${relativePath}`);
  
  try {
    // 1. Obtener tamaño original
    const originalStats = await fs.stat(filePath);
    const originalSize = originalStats.size;
    stats.totalSizeBefore += originalSize;
    
    // 2. Copiar original a olds (backup)
    let backupPath = null;
    if (CONFIG.backupOriginal) {
      try {
        backupPath = await backupToOlds(filePath);
        console.log(`   📦 Backup creado en: ${path.relative(CONFIG.baseDir, backupPath)}`);
      } catch (error) {
        throw new Error(`Error creando backup: ${error.message}`);
      }
    }
    
    // 3. Optimizar imagen (sobrescribe la original)
    const optimizationResult = await optimizeImage(filePath, originalSize);
    
    if (!optimizationResult.success) {
      throw new Error(`Error en optimización: ${optimizationResult.error}`);
    }
    
    // 4. Obtener nuevo tamaño
    const optimizedStats = await fs.stat(filePath);
    const optimizedSize = optimizedStats.size;
    stats.totalSizeAfter += optimizedSize;
    
    // 5. Generar versiones WebP si está configurado
    const webpResults = [];
    if (CONFIG.generateWebpCopies) {
      // WebP tamaño original
      const webpOriginal = await generateWebPVersion(filePath);
      if (webpOriginal.success) {
        webpResults.push(webpOriginal);
      }
      
      // WebP en diferentes tamaños
      for (const size of CONFIG.webpSizes) {
        const webpSize = await generateWebPVersion(filePath, size);
        if (webpSize.success) {
          webpResults.push(webpSize);
        }
      }
    }
    
    // 6. Eliminar original si se configuró (solo WebP)
    if (CONFIG.removeOriginalsAfterOptimization) {
      await fs.unlink(filePath);
      console.log(`   🗑️  Original eliminado (solo quedan WebP)`);
    }
    
    // 7. Mostrar resultados
    console.log(`   ✅ ${ext.toUpperCase()} optimizado: ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${optimizationResult.reduction}% reducción)`);
    
    if (webpResults.length > 0) {
      console.log(`   🎨 WebP generado: ${webpResults.length} versiones`);
      
      // Mostrar tamaño de WebP original si se generó
      const originalWebp = webpResults.find(r => r.size === 'original');
      if (originalWebp) {
        const webpReduction = ((optimizedSize - originalWebp.webpSize) / optimizedSize * 100).toFixed(1);
        console.log(`      WebP original: ${formatBytes(originalWebp.webpSize)} (${webpReduction}% vs optimizado)`);
      }
    }
    
    stats.processed++;
    return {
      filePath,
      backupPath,
      originalSize,
      optimizedSize,
      reduction: optimizationResult.reduction,
      webpVersions: webpResults,
    };
    
  } catch (error) {
    stats.errors++;
    console.log(`   ❌ Error: ${error.message}`);
    
    // NO restaurar automáticamente, el archivo original sigue en su lugar
    return null;
  }
}

/**
 * Genera reporte de optimización
 */
async function generateReport(processedImages) {
  const reportDir = path.join(CONFIG.baseDir, 'optimization-report');
  await fs.mkdir(reportDir, { recursive: true });
  
  const reportData = {
    generatedAt: new Date().toISOString(),
    config: CONFIG,
    stats: { ...stats },
    images: processedImages.filter(img => img !== null).map(img => ({
      path: path.relative(CONFIG.baseDir, img.filePath),
      backupPath: img.backupPath ? path.relative(CONFIG.baseDir, img.backupPath) : null,
      originalSize: img.originalSize,
      optimizedSize: img.optimizedSize,
      reduction: img.reduction,
      webpCount: img.webpVersions.length,
    })),
  };
  
  // Guardar JSON
  const jsonPath = path.join(reportDir, 'report.json');
  await fs.writeFile(jsonPath, JSON.stringify(reportData, null, 2), 'utf8');
  
  // Generar HTML
  const htmlContent = generateHTMLReport(reportData);
  const htmlPath = path.join(reportDir, 'index.html');
  await fs.writeFile(htmlPath, htmlContent, 'utf8');
  
  console.log(`\n📄 Reporte generado: file://${path.resolve(htmlPath)}`);
  
  return { jsonPath, htmlPath };
}

/**
 * Genera contenido HTML para el reporte
 */
function generateHTMLReport(data) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Optimización de Imágenes</title>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .subtitle { opacity: 0.9; font-size: 1.1rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #667eea; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .savings { background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); color: white; }
        .savings .stat-value { color: white; }
        table { width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        th { background: #667eea; color: white; padding: 1rem; text-align: left; }
        td { padding: 0.8rem 1rem; border-bottom: 1px solid #eee; }
        tr:hover { background: #f5f5f5; }
        .good { color: #4CAF50; font-weight: bold; }
        .bad { color: #f44336; }
        .warning { color: #ff9800; }
        .pill { display: inline-block; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
        .pill.webp { background: #e3f2fd; color: #1976d2; }
        .pill.jpeg { background: #f3e5f5; color: #7b1fa2; }
        .pill.png { background: #e8f5e8; color: #388e3c; }
        footer { text-align: center; margin-top: 2rem; color: #666; font-size: 0.9rem; padding: 1rem; border-top: 1px solid #ddd; }
        .config-info { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
        .config-item { margin-bottom: 0.5rem; }
        .config-label { font-weight: bold; color: #555; }
        .backup-info { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 Reporte de Optimización de Imágenes</h1>
            <div class="subtitle">Generado el ${new Date(data.generatedAt).toLocaleString()}</div>
        </header>
        
        <div class="backup-info">
            <strong>📦 Backup:</strong> Las imágenes originales fueron copiadas a <code>${data.config.backupDir}</code>
        </div>
        
        <div class="config-info">
            <h3>⚙️ Configuración utilizada</h3>
            <div class="config-item"><span class="config-label">Calidad JPEG:</span> ${data.config.jpegQuality}%</div>
            <div class="config-item"><span class="config-label">Calidad WebP:</span> ${data.config.webpQuality}%</div>
            <div class="config-item"><span class="config-label">Compresión PNG:</span> ${data.config.pngCompression}/9</div>
            <div class="config-item"><span class="config-label">WebP generados:</span> ${data.config.generateWebpCopies ? 'Sí' : 'No'}</div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.stats.processed}</div>
                <div class="stat-label">Imágenes Procesadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.stats.jpegOptimized}</div>
                <div class="stat-label">JPEG Optimizados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.stats.pngOptimized}</div>
                <div class="stat-label">PNG Optimizados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.stats.webpGenerated}</div>
                <div class="stat-label">WebP Generados</div>
            </div>
            <div class="stat-card savings">
                <div class="stat-value">${formatBytes(data.stats.totalSizeBefore - data.stats.totalSizeAfter)}</div>
                <div class="stat-label">Espacio Ahorrado</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.stats.totalSizeBefore > 0 ? ((data.stats.totalSizeBefore - data.stats.totalSizeAfter) / data.stats.totalSizeBefore * 100).toFixed(1) : 0}%</div>
                <div class="stat-label">Reducción Total</div>
            </div>
        </div>
        
        <h2>📁 Imágenes Procesadas (${data.images.length})</h2>
        <table>
            <thead>
                <tr>
                    <th>Archivo</th>
                    <th>Tamaño Original</th>
                    <th>Tamaño Optimizado</th>
                    <th>Reducción</th>
                    <th>Versiones WebP</th>
                    <th>Backup</th>
                </tr>
            </thead>
            <tbody>
                ${data.images.map(img => `
                <tr>
                    <td>${img.path}</td>
                    <td>${formatBytes(img.originalSize)}</td>
                    <td>${formatBytes(img.optimizedSize)}</td>
                    <td class="${img.reduction > 20 ? 'good' : img.reduction > 0 ? 'warning' : 'bad'}">
                        ${img.reduction}%
                    </td>
                    <td><span class="pill webp">${img.webpCount}</span></td>
                    <td>${img.backupPath ? '✅' : '❌'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <footer>
            <p>✨ Optimización completada exitosamente</p>
            <p><small>Los originales están disponibles en la carpeta <code>${data.config.backupDir}</code> por si necesitas restaurarlas.</small></p>
        </footer>
    </div>
    
    <script>
        // Ordenar tabla por reducción
        document.addEventListener('DOMContentLoaded', function() {
            const table = document.querySelector('table');
            if (table) {
                const headers = table.querySelectorAll('th');
                headers.forEach((header, index) => {
                    if (header.textContent.includes('Reducción')) {
                        header.style.cursor = 'pointer';
                        header.addEventListener('click', () => {
                            sortTable(index);
                        });
                    }
                });
            }
            
            function sortTable(column) {
                const table = document.querySelector('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                rows.sort((a, b) => {
                    const aVal = parseFloat(a.cells[column].textContent);
                    const bVal = parseFloat(b.cells[column].textContent);
                    return bVal - aVal; // Orden descendente
                });
                
                rows.forEach(row => tbody.appendChild(row));
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Muestra información del sistema
 */
function showSystemInfo() {
  console.log('\n⚙️  Configuración:');
  console.log(`   Directorio base: ${CONFIG.baseDir}`);
  console.log(`   Calidad JPEG: ${CONFIG.jpegQuality}%`);
  console.log(`   Calidad WebP: ${CONFIG.webpQuality}%`);
  console.log(`   Compresión PNG: ${CONFIG.pngCompression}/9`);
  console.log(`   Backup en: ${CONFIG.backupDir}`);
  console.log(`   Generar WebP: ${CONFIG.generateWebpCopies ? 'Sí' : 'No'}`);
  if (CONFIG.generateWebpCopies) {
    console.log(`   Tamaños WebP: ${CONFIG.webpSizes.join(', ')}px`);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando optimización de imágenes');
  console.log('📦 Los originales se copiarán a:', CONFIG.backupDir);
  console.log('💡 Los archivos originales se optimizarán en su ubicación');
  console.log();
  
  showSystemInfo();
  console.log('\n' + '─'.repeat(60) + '\n');
  
  try {
    // Verificar directorio base
    try {
      await fs.access(CONFIG.baseDir);
    } catch {
      console.error(`❌ El directorio '${CONFIG.baseDir}' no existe`);
      process.exit(1);
    }
    
    // Crear directorio olds si no existe
    if (CONFIG.backupOriginal) {
      await fs.mkdir(CONFIG.backupDir, { recursive: true });
      console.log(`📁 Carpeta de backup creada: ${CONFIG.backupDir}`);
    }
    
    // Buscar imágenes
    console.log('\n🔍 Buscando imágenes...');
    const imageFiles = [];
    
    for (const pattern of CONFIG.patterns) {
      const files = await glob(pattern, {
        cwd: CONFIG.baseDir,
        ignore: CONFIG.exclude,
        absolute: true,
      });
      imageFiles.push(...files);
    }
    
    // Eliminar duplicados
    const uniqueFiles = [...new Set(imageFiles)];
    
    console.log(`📁 Encontradas ${uniqueFiles.length} imágenes\n`);
    
    if (uniqueFiles.length === 0) {
      console.log('✅ No se encontraron imágenes para procesar');
      return;
    }
    
    // Procesar imágenes
    const processedImages = [];
    
    for (const filePath of uniqueFiles) {
      const result = await processImage(filePath);
      if (result) {
        processedImages.push(result);
      }
      console.log(); // Espacio entre imágenes
    }
    
    // Generar reporte
    if (processedImages.length > 0) {
      await generateReport(processedImages);
    }
    
    // Mostrar resumen final
    showFinalSummary();
    
  } catch (error) {
    console.error('\n❌ Error en el proceso:', error);
    process.exit(1);
  }
}

/**
 * Muestra resumen final
 */
function showFinalSummary() {
  console.log('\n' + '═'.repeat(60));
  console.log('🎉 OPTIMIZACIÓN COMPLETADA');
  console.log('═'.repeat(60));
  
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Procesadas: ${stats.processed}`);
  console.log(`   📸 JPEG optimizados: ${stats.jpegOptimized}`);
  console.log(`   🎨 PNG optimizados: ${stats.pngOptimized}`);
  console.log(`   🌐 WebP generados: ${stats.webpGenerated}`);
  console.log(`   📦 Backups creados: ${stats.backupsCreated}`);
  console.log(`   ⚠️  Errores: ${stats.errors}`);
  
  console.log(`\n💾 Tamaños:`);
  console.log(`   Original: ${formatBytes(stats.totalSizeBefore)}`);
  console.log(`   Optimizado: ${formatBytes(stats.totalSizeAfter)}`);
  
  if (stats.totalSizeBefore > 0 && stats.processed > 0) {
    const totalReduction = ((stats.totalSizeBefore - stats.totalSizeAfter) / stats.totalSizeBefore * 100).toFixed(1);
    const spaceSaved = stats.totalSizeBefore - stats.totalSizeAfter;
    
    console.log(`\n💰 Ahorro:`);
    console.log(`   Reducción: ${totalReduction}%`);
    console.log(`   Espacio: ${formatBytes(spaceSaved)}`);
    
    // Emoji según reducción
    const emoji = totalReduction > 30 ? '🚀' : totalReduction > 15 ? '⚡' : '👍';
    console.log(`\n${emoji} ¡Optimización exitosa!`);
  }
  
  console.log('\n' + '─'.repeat(60));
  
  if (CONFIG.backupOriginal) {
    console.log(`\n📦 Las imágenes originales están en: ${CONFIG.backupDir}`);
    console.log(`   Estructura de carpetas mantenida.`);
  }
  
  if (CONFIG.generateWebpCopies && stats.processed > 0) {
    console.log(`\n🌐 Versiones WebP disponibles:`);
    console.log(`   • Mismo nombre + .webp (tamaño original)`);
    console.log(`   • nombre-640w.webp, nombre-1024w.webp, etc.`);
    console.log(`\n   Usa en React:`);
    console.log(`
   <picture>
     <source srcset="imagen-640w.webp 640w, imagen-1024w.webp 1024w" type="image/webp">
     <img src="imagen.jpg" alt="Descripción" />
   </picture>`);
  }
  
  if (stats.processed > 0) {
    console.log(`\n📄 Revisa el reporte completo para más detalles.`);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export default main;