---
title: 'Todo en la IA funciona con contexto'
createAt: '2025-12-29'
updateAt: '2025-12-29'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'inteligencia artificial',
    'productividad',
    'desarrollo web',
    'herramientas',
    'tips',
  ]
description: 'Descubre cómo el contexto es la clave para obtener mejores respuestas de la IA. Tips, trucos y herramientas para alimentar correctamente a los modelos de lenguaje.'
image: '/david-portafolio/blogs/about_context_in_ia/home.webp'
---

# Todo en la IA funciona con contexto

<img src="/david-portafolio/blogs/about_context_in_ia/home.webp" alt="Contexto en IA" class="img-blog" />

Si hay algo que aprendí después de meses usando IA para programar, escribir y resolver problemas, es esto: **la calidad de la respuesta depende directamente del contexto que le das**.

No importa qué tan avanzado sea el modelo. Si le preguntas "¿por qué no funciona mi código?" sin mostrarle el código, te va a dar una respuesta genérica que probablemente no te sirva. Pero si le pasas el archivo, el error exacto y qué intentaste hacer, la respuesta cambia completamente.

Vamos a ver cómo aprovechar esto al máximo.

---

## ¿Por qué el contexto lo es todo?

Los modelos de lenguaje no tienen memoria permanente de ti ni de tu proyecto. Cada conversación empieza desde cero. Lo único que "saben" es lo que les pones en ese momento.

Piénsalo así: es como explicarle un problema a un compañero de trabajo que acaba de llegar. Si le dices "el botón no funciona", te va a mirar confundido. Pero si le dices "el botón de guardar en el formulario de registro no dispara el evento onClick, aquí está el componente", ya puede ayudarte.

La IA funciona exactamente igual. Más contexto relevante = mejor respuesta.

---

## Agentes: cuando la IA busca el contexto por ti

Antes de hablar de cómo pasar contexto manualmente, vale la pena mencionar que existen **agentes de IA** que pueden hacer esta tarea por ti.

Herramientas como Cursor, Claude Code o GitHub Copilot Workspace pueden explorar tu proyecto, leer archivos relevantes y construir el contexto automáticamente. Tú le dices qué quieres hacer y el agente se encarga de buscar lo que necesita.

¿El problema? No siempre están disponibles, a veces no encuentran exactamente lo que necesitas, y en muchos casos sigues necesitando pasar contexto adicional manualmente. Por eso es importante saber cómo hacerlo bien.

---

## Generando contexto de tu código: mkctx

<img src="/david-portafolio/blogs/about_context_in_ia/001.webp" alt="mkctx logo" class="img-blog" />

Cuando trabajo en un proyecto y necesito que la IA entienda la estructura de mi código, solía copiar y pegar archivos uno por uno. Terrible.

Por eso creé **mkctx**, una herramienta de línea de comandos que genera un archivo markdown con todo el contexto de tu proyecto, listo para pasárselo a la IA.

### Instalación

```bash
npm install -g mkctx
```

### Uso básico

```bash
cd tu-proyecto/
mkctx
```

Esto genera un archivo `context.md` con todo tu código organizado, con syntax highlighting y rutas de archivos. Perfecto para adjuntar a una conversación con la IA.

### Configuración

Puedes crear un archivo de configuración para personalizar qué incluir:

```bash
mkctx config
```

Esto crea un `mkctx.config.json` donde puedes definir:

```json
{
  "src": "./src",
  "ignore": "*.test.js, __tests__/, node_modules/, .git/",
  "output": "./mkctx",
  "first_comment": "/* Contexto del proyecto */",
  "last_comment": "/* Fin del contexto */",
  "dynamic": false
}
```

Lo que me gusta de mkctx es que automáticamente ignora `node_modules`, `.git` y otros archivos que no necesitas. El resultado es un archivo limpio que puedes adjuntar directamente.

Puedes encontrar el proyecto en [GitHub](https://github.com/David200197/mkctx).

---

## El truco del archivo adjunto

Aquí va algo que mucha gente no sabe: **la IA procesa mejor los archivos adjuntos que el texto pegado directamente**.

Cuando pegas código directamente en el chat, se mezcla con tu mensaje y el modelo puede perder el hilo. Pero cuando adjuntas un archivo (PDF, markdown, imagen), el contenido se estructura internamente con metadata adicional que ayuda a mantener la coherencia.

Esto es especialmente útil cuando:

- Tu contexto es muy largo (cientos o miles de líneas)
- Tienes múltiples archivos que necesitas incluir
- Quieres que la IA mantenga clara la separación entre tu pregunta y el contexto

En lugar de pegar todo en el chat, genera tu contexto con mkctx (o manualmente) y adjúntalo como archivo.

---

## Reportes: la fuente de contexto que estás ignorando

Este es un truco que descubrí por accidente y cambió cómo trabajo con IA.

Muchas herramientas generan reportes que puedes descargar. Estos reportes son **oro puro** como contexto para la IA.

### Mi experiencia con Lighthouse

Estaba intentando mejorar el rendimiento de un sitio y no sabía por dónde empezar. Entonces recordé que Lighthouse genera reportes en JSON.

Lo descargué, se lo pasé a la IA, y me dio recomendaciones específicas basadas en mi caso. No consejos genéricos de "optimiza tus imágenes", sino cosas como "tu archivo X está bloqueando el renderizado, muévelo a Y".

Logré subir significativamente la puntuación gracias a esto.

### Bundle Analyzer en Next.js

Si trabajas con Next.js y necesitas optimizar el tamaño de tus bundles, puedes generar reportes detallados:

```typescript
import type { NextConfig } from 'next'
import analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = analyzer({
  enabled: Boolean(process.env.ANALYZE),
  openAnalyzer: true,
  analyzerMode: 'json',
})

const nextConfig: NextConfig = {
  // tu configuración
}

export default withBundleAnalyzer(nextConfig)
```

Ejecutas `ANALYZE=true npm run build` y obtienes un reporte JSON con el peso de cada paquete. Ese reporte se lo pasas a la IA y te puede decir exactamente qué librerías están inflando tu bundle y qué alternativas usar.

La lección es simple: **antes de preguntar, revisa si tu herramienta genera reportes**. ESLint, TypeScript, testing frameworks, herramientas de accesibilidad... muchos tienen esta opción y es contexto gratuito.

---

## El orden importa: pon lo relevante al final

Aquí va una curiosidad técnica que me pareció interesante.

El contenido que está más cerca de tu pregunta tiene más "peso" en la respuesta. Si tienes un contexto muy largo, lo que pongas al final (justo antes de tu pregunta) va a tener más influencia.

Esto significa que si tienes varios archivos de contexto, organízalos así:

1. Contexto general del proyecto (al principio)
2. Archivos relacionados pero no críticos (en medio)
3. El archivo específico donde está el problema (al final)
4. Tu pregunta

No es que la IA ignore lo del principio, pero sí que lo del final tiene más relevancia inmediata.

---

## El truco de "no respondas todavía"

Cuando tienes mucho contexto que pasar, hay un problema: la IA quiere responder inmediatamente.

Le pegas un archivo enorme y antes de que puedas hacer tu pregunta, ya te está dando un resumen o haciendo suposiciones sobre qué necesitas. Pierdes tiempo y tokens.

La solución es simple. Cuando pases el contexto, añade algo como:

> "Este es el contexto de mi proyecto. No respondas todavía, espera a que te haga la pregunta."

O más corto:

> "Contexto. No respondas, espera mi pregunta."

La IA va a confirmar que recibió el contexto y va a esperar. Entonces puedes hacer tu pregunta específica sin que se adelante.

---

## La IA olvida: renueva el contexto

Las conversaciones largas tienen un problema: **la IA empieza a olvidar el contexto inicial**.

No es que literalmente lo borre, pero a medida que la conversación crece, el contexto del principio tiene menos peso. Si notas que la IA empieza a dar respuestas que ignoran cosas que ya le habías dicho, es momento de renovar.

Mis recomendaciones:

- Si la conversación se extiende mucho, pasa el contexto de nuevo
- Si hiciste cambios en el código, pasa la versión actualizada
- Si cambias de tema dentro de la misma conversación, considera empezar una nueva

A veces es más eficiente empezar una conversación fresca con contexto actualizado que seguir arrastrando una conversación vieja donde la IA ya perdió el hilo.

---

## Resumen

Los puntos clave para trabajar mejor con IA usando contexto:

1. **La calidad de la respuesta depende del contexto**: más información relevante = mejor ayuda
2. **Usa herramientas como mkctx** para generar contexto de código automáticamente
3. **Adjunta archivos en lugar de pegar texto**: la IA los procesa mejor
4. **Aprovecha los reportes** de tus herramientas (Lighthouse, Bundle Analyzer, etc.)
5. **Pon lo más relevante al final**, justo antes de tu pregunta
6. **Usa "no respondas todavía"** cuando pases contexto largo
7. **Renueva el contexto** en conversaciones largas

En un próximo artículo vamos a hablar sobre cómo estructurar prompts efectivos. Porque una vez que tienes el contexto correcto, la forma en que haces la pregunta también importa.

Por ahora, empieza a pensar en términos de contexto. Cada vez que la IA te dé una respuesta mediocre, pregúntate: ¿qué información le faltaba?
