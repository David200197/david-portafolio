---
title: 'Deploying Next.js to GitHub Pages: the guide I wish I had'
createAt: '2025-09-07'
updateAt: '2025-09-07'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['nextjs', 'github', 'github action', 'deployment']
description: 'In this post you will learn how to deploy a Next.js application using GitHub Actions, with all the tricks the official documentation does not tell you.'
image: '/david-portafolio/blogs/deploy_next_with_github_action/home.webp'
---

# Deploying Next.js to GitHub Pages: the guide I wish I had

<img src="/david-portafolio/blogs/deploy_next_with_github_action/home.webp" alt="GitHub Pages Configuration" class="img-blog" />

This is my first technical post, and I decided to start with something that took me way longer than it should have: deploying this portfolio built with Next.js to GitHub Pages.

Spoiler: Next.js doesn't make it easy if you're not using Vercel.

I spent several hours searching for documentation, trying different configurations, and discovering bugs that nobody mentions. I finally got it working thanks to Greg Rickaby's [nextjs-github-pages](https://github.com/gregrickaby/nextjs-github-pages) repository, which was my lifesaver.

So here's everything I learned, condensed so you don't have to go through the same pain.

---

## The step-by-step process

### 1. Configure `next.config.js` for static export

First, you need to tell Next.js to generate static files instead of relying on a server. You also need to set the `basePath` to your repository name (because GitHub Pages serves from `username.github.io/repo-name/`).

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/your-repo-name',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

Why `images: { unoptimized: true }`? Because Next.js image optimization requires a running server (SSR), and GitHub Pages only serves static files.

### 2. Create the `.nojekyll` file

This step is easy to forget and will break everything if you skip it.

Create an empty file named `.nojekyll` inside the `public/` folder.

What's it for? GitHub Pages uses Jekyll by default, and Jekyll ignores folders that start with an underscore (like `_next/`). Without this file, your CSS and JavaScript simply won't load.

### 3. Fix image paths

Here comes one of the most annoying parts. Unlike other frameworks like Angular or Create React App, Next.js **does not** automatically add the `basePath` to image paths.

You have to do it manually:

```tsx
// This does NOT work on GitHub Pages
<Image src="/logo.svg" alt="Logo" width={100} height={24} />

// This DOES work
<Image src="/your-repo-name/logo.svg" alt="Logo" width={100} height={24} />
```

To avoid repeating the basePath everywhere, I recommend creating a helper:

```tsx
// utils/paths.ts
export const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/your-repo-name' : ''
  return `${basePath}${path}`
}

// Usage
import { getAssetPath } from '@/utils/paths'

;<Image src={getAssetPath('/logo.svg')} alt="Logo" width={100} height={24} />
```

This also lets it work in local development without the basePath.

### 4. Set up the GitHub Actions workflow

Create the file `.github/workflows/deploy.yml`:

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

The workflow automatically detects whether you're using npm, yarn, or pnpm, so you don't need to modify it.

### 5. Configure GitHub Pages in your repository

Go to **Settings** → **Pages** → **Build and deployment** and select **GitHub Actions**.

<img src="/david-portafolio/blogs/deploy_next_with_github_action/001.webp" alt="GitHub Pages Configuration" class="w-full" />

### 6. Push and wait

```sh
git add .
git commit -m "Setup GitHub Pages deployment"
git push
```

Go to the **Actions** tab in your repository and you'll see the workflow running. In a couple of minutes, your site will be available at `https://your-username.github.io/your-repo-name/`.

---

## Things that can go wrong

### CSS doesn't load

You probably forgot the `.nojekyll` file. Jekyll is ignoring the `_next/` folder.

### Images don't appear

Check that all paths include the `basePath`. This is the most common mistake.

### Build fails on GitHub Actions but works locally

Make sure you're not using `webpack()` functions in your `next.config.js`. In recent versions of Next.js, the webpack method doesn't run correctly inside GitHub Actions:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/my-repo',
  images: { unoptimized: true },
  // ⚠️ This may fail on GitHub Actions
  webpack(config) {
    // custom configurations
    return config
  },
}
```

If you need webpack configurations, consider using alternatives or wait for this bug to be fixed.

---

## My take on Next.js outside of Vercel

After going through all of this, it's clear to me that Next.js is designed with Vercel in mind first. Documentation for deploying to other platforms is scarce, and there are unnecessary friction points (like the basePath issue with images).

I'm not saying it's bad—Next.js is still an excellent framework. But if your plan is to deploy it outside of Vercel, be prepared to do more research than you should have to.

A framework's strength lies in its flexibility. I hope this improves over time.

---

## Summary

1. Configure `output: 'export'` and `basePath` in `next.config.js`
2. Disable image optimization
3. Create `.nojekyll` in the `public/` folder
4. Adjust image paths to include the basePath
5. Set up the GitHub Actions workflow
6. Enable GitHub Actions as the deployment source in Settings → Pages

With this, you should have your Next.js site running on GitHub Pages without issues.
