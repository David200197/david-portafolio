---
title: 'Por qué dejé Jest y no pienso volver'
createAt: '2025-12-23'
updateAt: '2025-12-23'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['testing', 'vitest', 'jest', 'javascript']
description: 'Jest fue el estándar durante años, pero Vitest llegó para quedarse. Te cuento por qué hice el cambio y por qué probablemente tú también deberías.'
image: '/david-portafolio/blogs/vitest_vs_jest.webp'
---

# Por qué dejé Jest y no pienso volver

<img src="/david-portafolio/blogs/vitest_vs_jest.webp" alt="Vitest vs Jest" class="img-blog" />

Jest fue mi herramienta de testing durante años. Era el estándar, todos los tutoriales lo usaban, y funcionaba. ¿Para qué cambiar?

Hasta que probé Vitest.

La primera vez que corrí mis tests y terminaron en una fracción del tiempo, pensé que algo había fallado. Pero no. Simplemente era así de rápido.

Llevo años usándolo en proyectos reales y no he mirado atrás. Te cuento por qué.

---

## La velocidad no es un detalle menor

Seamos honestos: si tus tests tardan mucho, los corres menos. Y si los corres menos, pierden utilidad.

Jest tiene un problema de arquitectura. Cada archivo de test corre en un proceso separado con su propio contexto de Node.js. Esto garantiza aislamiento, pero tiene un costo brutal en rendimiento.

Vitest usa Vite bajo el capó, lo que significa:

- **Hot Module Replacement (HMR) para tests** — cuando cambias un archivo, solo se re-ejecutan los tests afectados
- **Ejecución en un solo proceso** con workers para paralelización real
- **ESM nativo** — sin transformaciones innecesarias

En números reales, estamos hablando de diferencias así:

| Proyecto            | Jest | Vitest |
| ------------------- | ---- | ------ |
| 50 tests unitarios  | ~8s  | ~1.2s  |
| 200 tests con mocks | ~25s | ~4s    |
| Watch mode (re-run) | ~3s  | ~200ms |

El watch mode es donde más se nota. Cambias una línea, y en menos de un segundo ya sabes si rompiste algo. Eso cambia completamente cómo desarrollas.

---

## La misma sintaxis que ya conoces

Esta fue la sorpresa más grata. Vitest usa la misma API que Jest:

```typescript
// Esto funciona exactamente igual en Jest y Vitest
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

Las diferencias principales:

- `jest.fn()` → `vi.fn()`
- `jest.mock()` → `vi.mock()`
- `jest.spyOn()` → `vi.spyOn()`

Eso es básicamente todo. Si sabes Jest, ya sabes Vitest.

Incluso puedes activar compatibilidad total con Jest:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true, // No necesitas importar describe, it, expect
  },
})
```

---

## Configuración que no te hace perder el tiempo

¿Recuerdas configurar Jest con TypeScript? Los `ts-jest`, los `moduleNameMapper`, los transforms, el `testEnvironment`... era un ritual.

Este es un `vitest.config.ts` típico:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // o 'jsdom' para tests de DOM
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

Ya. Eso es todo.

TypeScript funciona out of the box. ESM funciona out of the box. Si usas Vite para tu proyecto, Vitest hereda toda la configuración automáticamente.

---

## Cosas que Vitest hace mejor

### UI de tests integrada

```bash
npx vitest --ui
```

Te abre un dashboard en el navegador donde ves todos tus tests, su estado, el tiempo de ejecución, y puedes filtrar y re-ejecutar desde ahí. No es esencial, pero es muy útil para debugging.

### Snapshots más inteligentes

Los snapshots funcionan igual, pero Vitest te muestra diffs más claros cuando fallan:

```typescript
it('should match snapshot', () => {
  const user = { name: 'David', role: 'developer' }
  expect(user).toMatchSnapshot()
})
```

### Coverage sin configuración extra

```bash
npx vitest --coverage
```

Usa `v8` por defecto (el coverage nativo de Node), que es más rápido que `istanbul`. Si necesitas `istanbul`, es un flag.

### In-source testing

Esta es una feature interesante para tests pequeños:

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

Los tests viven junto al código. En producción, el bloque se elimina automáticamente.

---

## Migración desde Jest

Si tienes un proyecto con Jest y quieres migrar, el proceso es bastante directo:

1. Instala Vitest:

```bash
npm install -D vitest
```

2. Crea `vitest.config.ts` (o usa `vite.config.ts` si ya tienes Vite)

3. Busca y reemplaza en tus tests:
   - `jest.fn()` → `vi.fn()`
   - `jest.mock()` → `vi.mock()`
   - `jest.spyOn()` → `vi.spyOn()`

4. Actualiza el script en `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

Para proyectos grandes, puedes hacer la migración gradual. Vitest puede correr junto a Jest durante la transición.

---

## ¿Cuándo seguiría usando Jest?

Siendo honesto, hay casos donde Jest todavía tiene sentido:

- **Proyectos legacy muy grandes** donde la migración no justifica el esfuerzo
- **Equipos que no usan Vite** y no quieren agregar otra herramienta al stack
- **Tests e2e con ecosistema específico** (aunque para eso usaría Playwright directamente)

Pero para proyectos nuevos, especialmente si ya usas Vite, no veo razón para elegir Jest.

---

## Resumen

- **Velocidad**: Vitest es significativamente más rápido, especialmente en watch mode
- **Misma API**: si sabes Jest, ya sabes Vitest (solo cambia `jest` por `vi`)
- **Configuración mínima**: TypeScript y ESM funcionan sin setup adicional
- **Mejor DX**: UI integrada, mejor output de errores, coverage nativo
- **Integración con Vite**: si tu proyecto usa Vite, es la opción obvia

El testing debería ser rápido y sin fricción. Vitest lo logra mejor que Jest en 2024.

Si todavía no lo has probado, dale una oportunidad en tu próximo proyecto. Los primeros tests que corras te van a convencer.
