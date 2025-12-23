---
title: 'Desplegando Next.js en GitHub Pages: la guía que me hubiera ahorrado horas'
createAt: '2025-09-07'
updateAt: '2025-09-07'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['nextjs', 'github', 'github action', 'deployment']
description: 'En este post aprenderás cómo desplegar una aplicación creada con Next.js utilizando GitHub Actions, con todos los trucos que la documentación oficial no te cuenta.'
image: '/david-portafolio/blogs/deploy_next_with_github_action/home.webp'
---

# Desplegando Next.js en GitHub Pages: la guía que me hubiera ahorrado horas

<img src="/david-portafolio/blogs/deploy_next_with_github_action/home.webp" alt="Configuración de GitHub Pages" class="img-blog" />

Este es mi primer post técnico, y decidí empezar con algo que me costó más de lo que debería: desplegar este portafolio hecho con Next.js en GitHub Pages.

Spoiler: Next.js no te lo pone fácil si no usas Vercel.

Pasé varias horas buscando documentación, probando configuraciones, y descubriendo errores que nadie menciona. Al final lo logré gracias al repositorio [nextjs-github-pages](https://github.com/gregrickaby/nextjs-github-pages) de Greg Rickaby, que fue mi salvavidas.

Así que aquí está todo lo que aprendí, condensado para que no tengas que pasar por lo mismo.

---

## El proceso paso a paso

### 1. Configura `next.config.js` para exportación estática

Lo primero es decirle a Next.js que genere archivos estáticos en lugar de depender de un servidor. También necesitas configurar el `basePath` con el nombre de tu repositorio (porque GitHub Pages sirve desde `usuario.github.io/nombre-repo/`).

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/nombre-de-tu-repo',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

¿Por qué `images: { unoptimized: true }`? Porque la optimización de imágenes de Next.js requiere un servidor corriendo (SSR), y GitHub Pages solo sirve archivos estáticos.

### 2. Crea el archivo `.nojekyll`

Este paso es fácil de olvidar y te va a romper todo si no lo haces.

Crea un archivo vacío llamado `.nojekyll` dentro de la carpeta `public/`.

¿Para qué sirve? GitHub Pages usa Jekyll por defecto, y Jekyll ignora las carpetas que empiezan con guión bajo (como `_next/`). Sin este archivo, tu CSS y JavaScript simplemente no cargarán.

### 3. Ajusta las rutas de imágenes

Aquí viene una de las partes más molestas. A diferencia de otros frameworks como Angular o Create React App, Next.js **no** agrega automáticamente el `basePath` a las rutas de imágenes.

Tienes que hacerlo manualmente:

```tsx
// Así NO funciona en GitHub Pages
<Image src="/logo.svg" alt="Logo" width={100} height={24} />

// Así SÍ funciona
<Image src="/nombre-de-tu-repo/logo.svg" alt="Logo" width={100} height={24} />
```

Para no repetir el basePath en todos lados, te recomiendo crear un helper:

```tsx
// utils/paths.ts
export const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/nombre-de-tu-repo' : ''
  return `${basePath}${path}`
}

// Uso
import { getAssetPath } from '@/utils/paths'

;<Image src={getAssetPath('/logo.svg')} alt="Logo" width={100} height={24} />
```

Esto también te permite que funcione en desarrollo local sin el basePath.

### 4. Configura el workflow de GitHub Actions

Crea el archivo `.github/workflows/deploy.yml`:

```yml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Detect package manager
        id: detect-package-manager
        run: |
          if [ -f "${{ github.workspace }}/yarn.lock" ]; then
            echo "manager=yarn" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=yarn" >> $GITHUB_OUTPUT
            exit 0
          elif [ -f "${{ github.workspace }}/pnpm-lock.yaml" ]; then
            echo "manager=pnpm" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=pnpm" >> $GITHUB_OUTPUT
            npm install -g pnpm
            exit 0
          elif [ -f "${{ github.workspace }}/package.json" ]; then
            echo "manager=npm" >> $GITHUB_OUTPUT
            echo "command=ci" >> $GITHUB_OUTPUT
            echo "runner=npx --no-install" >> $GITHUB_OUTPUT
            exit 0
          else
            echo "Unable to determine package manager"
            exit 1
          fi

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: ${{ steps.detect-package-manager.outputs.manager }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}-

      - name: Install dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}

      - name: Build with Next.js
        run: ${{ steps.detect-package-manager.outputs.runner }} next build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

El workflow detecta automáticamente si usas npm, yarn o pnpm, así que no tienes que modificarlo.

### 5. Configura GitHub Pages en tu repositorio

Ve a **Settings** → **Pages** → **Build and deployment** y selecciona **GitHub Actions**.

<img src="/david-portafolio/blogs/deploy_next_with_github_action/001.webp" alt="Configuración de GitHub Pages" class="w-full" />

### 6. Push y a esperar

```sh
git add .
git commit -m "Setup GitHub Pages deployment"
git push
```

Ve a la pestaña **Actions** de tu repositorio y verás el workflow ejecutándose. En un par de minutos tu sitio estará disponible en `https://tu-usuario.github.io/nombre-de-tu-repo/`.

---

## Cosas que pueden salir mal

### El CSS no carga

Probablemente olvidaste el archivo `.nojekyll`. Jekyll está ignorando la carpeta `_next/`.

### Las imágenes no aparecen

Revisa que todas las rutas incluyan el `basePath`. Es el error más común.

### El build falla en GitHub Actions pero funciona local

Verifica que no estés usando funciones de `webpack()` en tu `next.config.js`. En las versiones recientes de Next.js, el método webpack no se ejecuta correctamente dentro de GitHub Actions:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/mi-repo',
  images: { unoptimized: true },
  // ⚠️ Esto puede fallar en GitHub Actions
  webpack(config) {
    // configuraciones custom
    return config
  },
}
```

Si necesitas configuraciones de webpack, considera usar alternativas o espera a que se solucione este bug.

---

## Mi opinión sobre Next.js fuera de Vercel

Después de pasar por todo esto, me queda claro que Next.js está diseñado pensando en Vercel primero. La documentación para desplegar en otras plataformas es escasa, y hay fricciones innecesarias (como el tema del basePath en imágenes).

No digo que sea malo, Next.js sigue siendo un framework excelente. Pero si tu plan es desplegarlo fuera de Vercel, prepárate para investigar más de lo que deberías.

La fortaleza de un framework está en su flexibilidad. Espero que con el tiempo esto mejore.

---

## Resumen

1. Configura `output: 'export'` y `basePath` en `next.config.js`
2. Desactiva la optimización de imágenes
3. Crea `.nojekyll` en la carpeta `public/`
4. Ajusta las rutas de imágenes para incluir el basePath
5. Configura el workflow de GitHub Actions
6. Activa GitHub Actions como fuente de deploy en Settings → Pages

Con esto deberías tener tu sitio Next.js corriendo en GitHub Pages sin problemas.
