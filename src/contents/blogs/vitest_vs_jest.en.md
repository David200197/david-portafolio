---
title: "Why I left Jest and I'm not going back"
createAt: '2025-12-23'
updateAt: '2025-12-23'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['testing', 'vitest', 'jest', 'javascript']
description: "Jest was the standard for years, but Vitest is here to stay. Here's why I made the switch and why you probably should too."
image: '/david-portafolio/blogs/vitest_vs_jest.webp'
---

# Why I left Jest and I'm not going back

<img src="/david-portafolio/blogs/vitest_vs_jest.webp" alt="Vitest vs Jest" class="img-blog" />

Jest was my testing tool for years. It was the standard, every tutorial used it, and it worked. Why change?

Until I tried Vitest.

The first time I ran my tests and they finished in a fraction of the time, I thought something had failed. But no. It was just that fast.

I've been using it in real projects for years and haven't looked back. Here's why.

---

## Speed is not a minor detail

Let's be honest: if your tests take too long, you run them less often. And if you run them less, they lose their purpose.

Jest has an architecture problem. Each test file runs in a separate process with its own Node.js context. This guarantees isolation, but has a brutal performance cost.

Vitest uses Vite under the hood, which means:

- **Hot Module Replacement (HMR) for tests** — when you change a file, only the affected tests re-run
- **Single process execution** with workers for real parallelization
- **Native ESM** — no unnecessary transformations

In real numbers, we're talking about differences like this:

| Project              | Jest | Vitest |
| -------------------- | ---- | ------ |
| 50 unit tests        | ~8s  | ~1.2s  |
| 200 tests with mocks | ~25s | ~4s    |
| Watch mode (re-run)  | ~3s  | ~200ms |

Watch mode is where you notice it most. You change a line, and in less than a second you already know if you broke something. That completely changes how you develop.

---

## The same syntax you already know

This was the most pleasant surprise. Vitest uses the same API as Jest:

```typescript
// This works exactly the same in Jest and Vitest
import { describe, it, expect, vi } from 'vitest'

describe('Calculator', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should handle mocks', () => {
    const mockFn = vi.fn()
    mockFn('hello')
    expect(mockFn).toHaveBeenCalledWith('hello')
  })
})
```

The main differences:

- `jest.fn()` → `vi.fn()`
- `jest.mock()` → `vi.mock()`
- `jest.spyOn()` → `vi.spyOn()`

That's basically it. If you know Jest, you already know Vitest.

You can even enable full Jest compatibility:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true, // No need to import describe, it, expect
  },
})
```

---

## Configuration that doesn't waste your time

Remember configuring Jest with TypeScript? The `ts-jest`, the `moduleNameMapper`, the transforms, the `testEnvironment`... it was a ritual.

This is a typical `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // or 'jsdom' for DOM tests
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

Done. That's it.

TypeScript works out of the box. ESM works out of the box. If you use Vite for your project, Vitest inherits all the configuration automatically.

---

## Things Vitest does better

### Integrated test UI

```bash
npx vitest --ui
```

Opens a dashboard in your browser where you see all your tests, their status, execution time, and you can filter and re-run from there. Not essential, but very useful for debugging.

### Smarter snapshots

Snapshots work the same, but Vitest shows clearer diffs when they fail:

```typescript
it('should match snapshot', () => {
  const user = { name: 'David', role: 'developer' }
  expect(user).toMatchSnapshot()
})
```

### Coverage without extra configuration

```bash
npx vitest --coverage
```

Uses `v8` by default (Node's native coverage), which is faster than `istanbul`. If you need `istanbul`, it's just a flag.

### In-source testing

This is an interesting feature for small tests:

```typescript
// utils/math.ts
export function add(a: number, b: number) {
  return a + b
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('adds numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
}
```

Tests live alongside the code. In production, the block is automatically removed.

---

## Migrating from Jest

If you have a project with Jest and want to migrate, the process is pretty straightforward:

1. Install Vitest:

```bash
npm install -D vitest
```

2. Create `vitest.config.ts` (or use `vite.config.ts` if you already have Vite)

3. Find and replace in your tests:
   - `jest.fn()` → `vi.fn()`
   - `jest.mock()` → `vi.mock()`
   - `jest.spyOn()` → `vi.spyOn()`

4. Update the script in `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

For large projects, you can migrate gradually. Vitest can run alongside Jest during the transition.

---

## When would I still use Jest?

Being honest, there are cases where Jest still makes sense:

- **Very large legacy projects** where migration doesn't justify the effort
- **Teams that don't use Vite** and don't want to add another tool to the stack
- **E2E tests with specific ecosystem** (though for that I'd use Playwright directly)

But for new projects, especially if you already use Vite, I see no reason to choose Jest.

---

## Summary

- **Speed**: Vitest is significantly faster, especially in watch mode
- **Same API**: if you know Jest, you already know Vitest (just change `jest` to `vi`)
- **Minimal configuration**: TypeScript and ESM work without additional setup
- **Better DX**: integrated UI, better error output, native coverage
- **Vite integration**: if your project uses Vite, it's the obvious choice

Testing should be fast and frictionless. Vitest achieves this better than Jest in 2024.

If you haven't tried it yet, give it a shot on your next project. The first tests you run will convince you.
