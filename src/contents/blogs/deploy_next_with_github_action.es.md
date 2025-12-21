---
title: 'Cómo desplegar Next.js con GitHub Actions'
createAt: '2025-09-07'
updateAt: '2025-09-07'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['nextjs', 'github', 'github action', 'deployment', 'reflections']
description: 'En este post aprenderás cómo desplegar una aplicación creada con Next.js utilizando GitHub Actions.'
image: '/david-portafolio/blogs/deploy_next_with_github_action/home.webp'
---

# Cómo desplegar Next.js con GitHub Actions

<img src="/david-portafolio/blogs/deploy_next_with_github_action/home.webp" alt="Configuración de GitHub Pages" class="img-blog" />

## Un poco de contexto

Este es mi primer post técnico, y quiero hablar de un tema que me generó bastantes dolores de cabeza: desplegar este portafolio con **Next.js**. Al final de este artículo compartiré una breve reflexión, porque descubrí que hay muy poca documentación al respecto y que, además, **Vercel no facilita demasiado usar Next.js fuera de su propia plataforma**.

Quiero agradecer especialmente a [Greg Rickaby](https://github.com/gregrickaby) por su repositorio [nextjs-github-pages](https://github.com/gregrickaby/nextjs-github-pages), que me sirvió de guía para lograr desplegar mi portafolio en **GitHub Pages**.

---

## Pasos para desplegar Next.js con GitHub Actions

### 1. Configura `next.config.js`

Primero, asegúrate de habilitar `output: "export"` para la generación de archivos estáticos. Configura también `basePath` con el nombre de tu repositorio, y deshabilita la optimización de imágenes, ya que solo funciona con SSR (Server-Side Rendering).

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/nextjs-github-pages',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### 2. Agrega .nojekyll en la carpeta public

Crea un archivo vacío llamado .nojekyll dentro de la carpeta public.
Esto le indica a GitHub Pages que desactive el procesamiento automático de Jekyll, necesario para que funcione correctamente el directorio \_next/ generado por Next.js.

### 3. Ajusta las rutas de imágenes con basePath

Cualquier imagen debe incluir el basePath configurado en next.config.js.

```tsx
<Image
  src="/nextjs-github-pages/vercel.svg"
  alt="Vercel Logo"
  className={styles.vercelLogo}
  width={100}
  height={24}
  priority
/>

// or

<img
  src="/nextjs-github-pages/vercel.svg"
  alt="Vercel Logo"
  className={styles.vercelLogo}
/>

```

En frameworks como Angular o React, esto se maneja automáticamente. Next.js aún no lo resuelve, así que puedes crear un helper para simplificarlo:

```tsx
const getImagePath = (path: string) => {
  return '/nextjs-github-pages/' + path
}

const Foo = () => (
  <Image
    src={getImagePath('vercel.svg')}
    alt="Vercel Logo"
    className={styles.vercelLogo}
    width={100}
    height={24}
    priority
  />
)
```

### 4. Configura el workflow de GitHub Actions

Ahora toca configurar el workflow que automatizará el despliegue.
Crea un archivo en .github/workflows/deploy.yml con el siguiente contenido:

```yml
name: Deploy Next.js site to Pages

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

Después:

Ve a la pestaña Settings en tu repositorio.

Haz clic en Pages.

En Build and Deployment, selecciona GitHub Actions.

<img src="/david-portafolio/blogs/deploy_next_with_github_action/001.webp" alt="Configuración de GitHub Pages" class="w-full" />

### 5. Sube tus cambios a GitHub

```sh
git add . && git commit -m "initial commit" && git push
```

¡Y listo! Tu aplicación Next.js quedará desplegada en GitHub Pages.

## Detalles a tener en cuenta

Actualmente, en la versión más reciente de Next.js, el método webpack de next.config.js no se ejecuta dentro de GitHub Actions.

```ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/nextjs-github-pages',
  images: { unoptimized: true },
  webpack() {
    // Esto no funciona en GitHub Actions
  },
}
```

Como recomendación evita depender de webpack() hasta que este problema esté solucionado.

## Una pequeña reflexión

Al terminar este despliegue, me quedó una sensación clara: Next.js está fuertemente atado a Vercel. La falta de documentación para escenarios fuera de su plataforma hace que el proceso sea más complejo de lo necesario.

En mi opinión, la verdadera fortaleza de un framework radica en su flexibilidad y en brindar la mejor experiencia de desarrollo posible. Eso es lo que permite que más personas lo adopten.

Espero que este artículo te sea útil y te ahorre horas de frustración.
¡Gracias por leer! Nos vemos en próximos posts.
