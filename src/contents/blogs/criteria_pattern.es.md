---
title: 'Patrón Criteria: Cómo dejé de crear métodos findByX para cada consulta'
createAt: '2025-12-02'
updateAt: '2026-06-10'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['programación', 'patrones', 'repositorio']
description: 'En este artículo exploramos qué es el patrón Criteria y cómo implementarlo en TypeScript para construir consultas flexibles y reutilizables'
image: '/david-portafolio/blogs/criteria_pattern.webp'
---

# Patrón Criteria: Cómo dejé de crear métodos findByX para cada consulta

<img src='/david-portafolio/blogs/criteria_pattern.webp' alt="Patrón Criteria" class="img-blog" />

¿Te ha pasado que empiezas un proyecto con un repositorio limpio y, tres meses después, tienes algo así?

```typescript
class ProductRepository {
  findById(id: string) {
    /* ... */
  }
  findByCategory(category: string) {
    /* ... */
  }
  findByPriceRange(min: number, max: number) {
    /* ... */
  }
  findActiveProducts() {
    /* ... */
  }
  findByCategoryAndPriceRange(category: string, min: number, max: number) {
    /* ... */
  }
  findActiveByCategory(category: string) {
    /* ... */
  }
  findTopSellingByCategory(category: string, limit: number) {
    /* ... */
  }
  // ... y la lista sigue creciendo
}
```

A mí me pasó. Y la verdad, era un desastre mantener eso.

El **patrón Criteria** me salvó de ese infierno. La idea es simple: en lugar de crear un método para cada combinación posible de filtros, creamos un objeto que describe _qué_ queremos buscar, y dejamos que el repositorio se encargue del _cómo_.

## ¿Qué vamos a construir?

En este artículo vamos a implementar un sistema completo de Criteria que incluye:

1. Una clase `Criteria` base e inmutable
2. Métodos para combinar criterios con AND y OR
3. Criterios especializados reutilizables
4. Transformadores para SQL y MongoDB
5. Un filtro para colecciones en memoria (súper útil para testing)
6. Un transformador a Drizzle con tipado y seguridad reales
7. Integración con un Repository

---

## 1. La clase Criteria: el corazón del patrón

Empecemos por definir los tipos básicos. Necesitamos representar filtros, operadores y ordenamientos:

```typescript
// Criteria.ts

/**
 * Operadores de comparación disponibles
 */
export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'IN' | 'LIKE'

/**
 * Operadores lógicos para combinar filtros
 */
export type LogicalOperator = 'AND' | 'OR'

/**
 * Un filtro simple sobre un campo
 */
export interface Filter {
  field: string
  operator: Operator
  value: any
}

/**
 * Un filtro compuesto que combina varios filtros
 */
export interface CompositeFilter {
  operator: LogicalOperator
  filters: (Filter | CompositeFilter)[]
}

export type CriteriaFilter = Filter | CompositeFilter

/**
 * Ordenamiento de resultados
 */
export interface Order {
  field: string
  direction: 'ASC' | 'DESC'
}

/**
 * Opciones para construir un Criteria
 */
export interface CriteriaOptions {
  filters?: CriteriaFilter[]
  orders?: Order[]
  limit?: number
  offset?: number
}
```

Ahora la clase `Criteria` en sí. La hice **inmutable** a propósito: una vez que creas un criterio, no cambia. Esto evita bugs sutiles cuando pasas el mismo criterio a varios lugares.

```typescript
export class Criteria {
  private readonly filters: CriteriaFilter[]
  private readonly orders: Order[]
  private readonly limitValue?: number
  private readonly offsetValue?: number

  constructor(options: CriteriaOptions = {}) {
    this.filters = options.filters ?? []
    this.orders = options.orders ?? []
    this.limitValue = options.limit
    this.offsetValue = options.offset
  }

  getFilters(): CriteriaFilter[] {
    return this.filters
  }

  getOrders(): Order[] {
    return this.orders
  }

  getLimit(): number | undefined {
    return this.limitValue
  }

  getOffset(): number | undefined {
    return this.offsetValue
  }
```

Lo interesante viene con los métodos estáticos para combinar criterios. En lugar de crear lógica complicada dentro de cada criterio, simplemente los combinamos:

```typescript
  /**
   * Combina varios criterios con AND
   */
  static and(...criteriaArray: Criteria[]): Criteria {
    const combinedFilters: CriteriaFilter[] = criteriaArray
      .map((c) => c.getFilters())
      .filter((f) => f.length > 0)
      .map((f) => (f.length === 1 ? f[0] : { operator: 'AND', filters: f }))

    const combinedOrders: Order[] = criteriaArray.flatMap((c) => c.getOrders())

    const limitValues = criteriaArray
      .map((c) => c.getLimit())
      .filter((l) => l !== undefined) as number[]
    const offsetValues = criteriaArray
      .map((c) => c.getOffset())
      .filter((o) => o !== undefined) as number[]

    return new Criteria({
      filters: combinedFilters,
      orders: combinedOrders,
      limit: limitValues[0],
      offset: offsetValues[0],
    })
  }

  /**
   * Combina varios criterios con OR
   */
  static or(...criteriaArray: Criteria[]): Criteria {
    const combinedFilters: CriteriaFilter[] = criteriaArray
      .map((c) => c.getFilters())
      .filter((f) => f.length > 0)
      .map((f) => (f.length === 1 ? f[0] : { operator: 'OR', filters: f }))

    const combinedOrders: Order[] = criteriaArray.flatMap((c) => c.getOrders())

    const limitValues = criteriaArray
      .map((c) => c.getLimit())
      .filter((l) => l !== undefined) as number[]
    const offsetValues = criteriaArray
      .map((c) => c.getOffset())
      .filter((o) => o !== undefined) as number[]

    return new Criteria({
      filters: combinedFilters,
      orders: combinedOrders,
      limit: limitValues[0],
      offset: offsetValues[0],
    })
  }
}
```

---

## 2. Criterios especializados: encapsulando reglas de negocio

Aquí es donde el patrón empieza a brillar. En lugar de tener la lógica de "productos más vendidos" dispersa por el código, la encapsulamos en una clase:

```typescript
// TopProductCriteria.ts
import { Criteria, Filter, Order } from './Criteria'

export class TopProductCriteria extends Criteria {
  constructor(params: { limit?: number; category?: string } = {}) {
    const filters: Filter[] = [
      { field: 'status', operator: '=', value: 'active' },
      { field: 'stock', operator: '>', value: 0 },
    ]

    if (params.category) {
      filters.push({ field: 'category', operator: '=', value: params.category })
    }

    const orders: Order[] = [
      { field: 'sales', direction: 'DESC' },
      { field: 'rating', direction: 'DESC' },
    ]

    super({
      filters,
      orders,
      limit: params.limit ?? 10,
      offset: 0,
    })
  }
}
```

Ahora cuando alguien del equipo necesite los productos más vendidos, solo hace:

```typescript
const topProducts = new TopProductCriteria()
const topElectronics = new TopProductCriteria({
  limit: 5,
  category: 'Electronics',
})
```

Nada de revisar qué filtros aplicar, ni copiar código de otro lado.

---

## 3. Transformadores: el puente hacia la base de datos

El Criteria es agnóstico a la base de datos. Para ejecutarlo, necesitamos transformarlo al lenguaje que entienda nuestro motor de base de datos.

### Transformador a SQL (versión didáctica, **no usar en producción**)

Empecemos con la versión más obvia: construir el SQL como un string. Es útil para _entender_ el patrón, pero más abajo verás por qué no debe llegar a producción tal cual.

```typescript
// CriteriaToSqlTransformer.ts
import { Criteria, CriteriaFilter } from './Criteria'

function filterToSql(f: CriteriaFilter): string {
  if ('field' in f) {
    // Filtro simple
    const value =
      typeof f.value === 'string' ? `'${f.value.replace(/'/g, "''")}'` : f.value

    if (f.operator === 'IN' && Array.isArray(f.value)) {
      const formattedValues = f.value.map((v) =>
        typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
      )
      return `${f.field} IN (${formattedValues.join(', ')})`
    }

    if (f.operator === 'LIKE') {
      return `${f.field} LIKE '%${f.value.replace(/'/g, "''")}%'`
    }

    return `${f.field} ${f.operator} ${value}`
  } else {
    // Filtro compuesto
    const inner = f.filters.map(filterToSql).join(` ${f.operator} `)
    return `(${inner})`
  }
}

export class CriteriaToSqlTransformer {
  transform(criteria: Criteria, tableName: string): string {
    let query = `SELECT * FROM ${tableName}`

    const filters = criteria.getFilters()
    if (filters.length > 0) {
      const whereClause = filters.map(filterToSql).join(' AND ')
      query += ` WHERE ${whereClause}`
    }

    const orders = criteria.getOrders()
    if (orders.length > 0) {
      query +=
        ' ORDER BY ' + orders.map((o) => `${o.field} ${o.direction}`).join(', ')
    }

    const limit = criteria.getLimit()
    const offset = criteria.getOffset()

    if (limit !== undefined) {
      query += ` LIMIT ${limit}`
      if (offset !== undefined) {
        query += ` OFFSET ${offset}`
      }
    }

    return query + ';'
  }
}
```

> ⚠️ **Advertencia de seguridad.** Este transformador escapa el _valor_ (las comillas simples), pero interpola `f.field` y `f.operator` **crudos** dentro del string SQL. Y aquí está el problema de fondo: el caso de uso natural del Criteria es construir filtros dinámicos a partir de entrada externa (query params, body de una petición). Eso significa que `field` puede venir del cliente. Un `field` como `"1=1; DROP TABLE products; --"` o un valor que escape el patrón `LIKE` abre la puerta a **inyección SQL**. El escape manual de comillas es, justamente, el antipatrón que los parámetros de consulta resuelven de raíz.
>
> Nunca construyas SQL concatenando identificadores ni valores que provengan del exterior. La sección 6 muestra cómo cerrar este agujero usando un ORM que parametriza y, de paso, valida los campos contra el schema real.

### Transformador a MongoDB

```typescript
// CriteriaToMongoTransformer.ts
import { Criteria, CriteriaFilter } from './Criteria'

type MongoFilter = Record<string, any>

function filterToMongo(f: CriteriaFilter): MongoFilter {
  if ('field' in f) {
    switch (f.operator) {
      case '=':
        return { [f.field]: f.value }
      case '!=':
        return { [f.field]: { $ne: f.value } }
      case '>':
        return { [f.field]: { $gt: f.value } }
      case '>=':
        return { [f.field]: { $gte: f.value } }
      case '<':
        return { [f.field]: { $lt: f.value } }
      case '<=':
        return { [f.field]: { $lte: f.value } }
      case 'IN':
        return {
          [f.field]: { $in: Array.isArray(f.value) ? f.value : [f.value] },
        }
      case 'LIKE':
        return { [f.field]: { $regex: f.value, $options: 'i' } }
      default:
        throw new Error(`Operador no soportado: ${f.operator}`)
    }
  } else {
    const inner = f.filters.map(filterToMongo)
    return f.operator === 'AND' ? { $and: inner } : { $or: inner }
  }
}

export interface MongoQueryOptions {
  sort?: Record<string, 1 | -1>
  limit?: number
  skip?: number
}

export class CriteriaToMongoTransformer {
  transform(criteria: Criteria): {
    filter: MongoFilter
    options: MongoQueryOptions
  } {
    const filters = criteria.getFilters()

    const mongoFilter: MongoFilter =
      filters.length > 0
        ? filters.length === 1
          ? filterToMongo(filters[0])
          : { $and: filters.map(filterToMongo) }
        : {}

    const options: MongoQueryOptions = {}

    const orders = criteria.getOrders()
    if (orders.length > 0) {
      options.sort = orders.reduce(
        (acc, order) => {
          acc[order.field] = order.direction === 'ASC' ? 1 : -1
          return acc
        },
        {} as Record<string, 1 | -1>
      )
    }

    const limit = criteria.getLimit()
    const offset = criteria.getOffset()

    if (limit !== undefined) options.limit = limit
    if (offset !== undefined) options.skip = offset

    return { filter: mongoFilter, options }
  }
}
```

> 📝 **Nota.** Mongo sale mejor parado que el string SQL porque el driver trata los valores como datos, no como código: el `$regex` del operador `LIKE` no permite escapar a "otra consulta" como sí ocurre concatenando SQL. Pero `f.field` sigue siendo un nombre de campo que viene del exterior sin validar. Un campo arbitrario puede exponer datos que no querías filtrar (por ejemplo, un campo interno tipo `passwordHash`) o, con operadores de Mongo mal saneados, habilitar _NoSQL injection_. La misma solución de la sección 6 —un allowlist de campos— aplica aquí.

---

## 4. CollectionFilter: Criteria para colecciones en memoria

Este es un bonus que me ha resultado increíblemente útil, especialmente para testing. ¿Por qué mockear una base de datos cuando puedes filtrar un array con la misma API?

La idea es simple: implementamos la misma lógica de filtrado, ordenamiento y paginación, pero sobre arrays de JavaScript.

```typescript
// CollectionFilter.ts
import {
  Criteria,
  CriteriaFilter,
  Order,
  Filter,
  CompositeFilter,
} from './Criteria'

export class CollectionFilter<T> {
  private readonly collection: T[]

  constructor(collection: T[]) {
    this.collection = [...collection] // Copia para evitar mutaciones
  }

  /**
   * Busca todos los elementos que coincidan con el criterio
   */
  findAll(criteria?: Criteria): T[] {
    if (!criteria) {
      return [...this.collection]
    }

    let filtered = this.applyFilters(this.collection, criteria.getFilters())
    filtered = this.applyOrdering(filtered, criteria.getOrders())
    filtered = this.applyPagination(
      filtered,
      criteria.getLimit(),
      criteria.getOffset()
    )

    return filtered
  }

  /**
   * Busca un solo elemento
   */
  findOne(criteria?: Criteria): T | undefined {
    const results = this.findAll(
      criteria ? new Criteria({ ...criteria, limit: 1 }) : undefined
    )
    return results[0]
  }

  /**
   * Cuenta cuántos elementos coinciden
   */
  count(criteria?: Criteria): number {
    if (!criteria) {
      return this.collection.length
    }
    return this.applyFilters(this.collection, criteria.getFilters()).length
  }

  /**
   * Verifica si existe al menos un elemento
   */
  exists(criteria?: Criteria): boolean {
    return this.findOne(criteria) !== undefined
  }

  private applyFilters(collection: T[], filters: CriteriaFilter[]): T[] {
    if (filters.length === 0) {
      return [...collection]
    }

    return collection.filter((item) => {
      return this.evaluateFilters(item, filters, 'AND')
    })
  }

  private evaluateFilters(
    item: T,
    filters: CriteriaFilter[],
    logicalOperator: 'AND' | 'OR' = 'AND'
  ): boolean {
    if (filters.length === 0) return true

    const results = filters.map((filter) => this.evaluateFilter(item, filter))

    return logicalOperator === 'AND'
      ? results.every((r) => r)
      : results.some((r) => r)
  }

  private evaluateFilter(item: T, filter: CriteriaFilter): boolean {
    if (this.isCompositeFilter(filter)) {
      return this.evaluateFilters(item, filter.filters, filter.operator)
    }

    const simpleFilter = filter as Filter
    const fieldValue = this.getFieldValue(item, simpleFilter.field)

    return this.compareValues(
      fieldValue,
      simpleFilter.operator,
      simpleFilter.value
    )
  }

  /**
   * Obtiene el valor de un campo, soportando propiedades anidadas como 'profile.role'
   */
  private getFieldValue(item: T, fieldPath: string): any {
    const parts = fieldPath.split('.')
    let value: any = item

    for (const part of parts) {
      if (value === null || value === undefined) return undefined
      value = value[part]
    }

    return value
  }

  private compareValues(
    itemValue: any,
    operator: string,
    filterValue: any
  ): boolean {
    switch (operator) {
      case '=':
        return itemValue === filterValue
      case '!=':
        return itemValue !== filterValue
      case '<':
        return itemValue < filterValue
      case '<=':
        return itemValue <= filterValue
      case '>':
        return itemValue > filterValue
      case '>=':
        return itemValue >= filterValue
      case 'IN':
        if (!Array.isArray(filterValue)) {
          throw new Error('El valor para IN debe ser un array')
        }
        return filterValue.includes(itemValue)
      case 'LIKE':
        if (typeof itemValue !== 'string' || typeof filterValue !== 'string') {
          return false
        }
        const pattern = filterValue.replace(/%/g, '.*').replace(/_/g, '.')
        return new RegExp(`^${pattern}$`, 'i').test(itemValue)
      default:
        throw new Error(`Operador no soportado: ${operator}`)
    }
  }

  private applyOrdering(collection: T[], orders: Order[]): T[] {
    if (orders.length === 0) return [...collection]

    return [...collection].sort((a, b) => {
      for (const order of orders) {
        const aValue = this.getFieldValue(a, order.field)
        const bValue = this.getFieldValue(b, order.field)

        if (aValue === undefined || aValue === null) {
          return order.direction === 'ASC' ? -1 : 1
        }
        if (bValue === undefined || bValue === null) {
          return order.direction === 'ASC' ? 1 : -1
        }

        if (aValue < bValue) return order.direction === 'ASC' ? -1 : 1
        if (aValue > bValue) return order.direction === 'ASC' ? 1 : -1
      }
      return 0
    })
  }

  private applyPagination(
    collection: T[],
    limit?: number,
    offset?: number
  ): T[] {
    let result = [...collection]

    if (offset !== undefined && offset > 0) {
      result = result.slice(offset)
    }

    if (limit !== undefined && limit > 0) {
      result = result.slice(0, limit)
    }

    return result
  }

  private isCompositeFilter(filter: CriteriaFilter): filter is CompositeFilter {
    return 'filters' in filter
  }
}
```

### Ejemplo práctico del CollectionFilter

Veamos cómo usarlo con datos reales:

```typescript
interface User {
  id: number
  name: string
  age: number
  active: boolean
  email: string
  profile?: {
    role: string
    department: string
  }
}

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 25,
    active: true,
    email: 'john@example.com',
    profile: { role: 'admin', department: 'IT' },
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 30,
    active: false,
    email: 'jane@example.com',
    profile: { role: 'user', department: 'HR' },
  },
  {
    id: 3,
    name: 'Bob Johnson',
    age: 20,
    active: true,
    email: 'bob@example.com',
    profile: { role: 'user', department: 'IT' },
  },
  {
    id: 4,
    name: 'Alice Brown',
    age: 35,
    active: true,
    email: 'alice@example.com',
    profile: { role: 'manager', department: 'Sales' },
  },
]

const filter = new CollectionFilter(users)

// Buscar usuarios activos mayores de 21 años
const activeAdults = filter.findAll(
  new Criteria({
    filters: [
      { field: 'active', operator: '=', value: true },
      { field: 'age', operator: '>', value: 21 },
    ],
    orders: [{ field: 'age', direction: 'DESC' }],
  })
)
// Resultado: [Alice (35), John (25)]

// Buscar por departamento usando propiedades anidadas
const itUsers = filter.findAll(
  new Criteria({
    filters: [{ field: 'profile.department', operator: '=', value: 'IT' }],
  })
)
// Resultado: [John, Bob]

// Buscar usuarios cuyo nombre contenga "Smith"
const smiths = filter.findAll(
  new Criteria({
    filters: [{ field: 'name', operator: 'LIKE', value: '%Smith%' }],
  })
)
// Resultado: [Jane Smith]

// Buscar usuarios de 20 o 35 años usando IN
const specificAges = filter.findAll(
  new Criteria({
    filters: [{ field: 'age', operator: 'IN', value: [20, 35] }],
  })
)
// Resultado: [Bob (20), Alice (35)]

// Filtro compuesto: menores de 25 O mayores de 30
const youngOrOld = filter.findAll(
  new Criteria({
    filters: [
      {
        operator: 'OR',
        filters: [
          { field: 'age', operator: '<', value: 25 },
          { field: 'age', operator: '>', value: 30 },
        ],
      },
    ],
  })
)
// Resultado: [Bob (20), Alice (35)]
```

Lo mejor de este approach es que **los tests se vuelven triviales**:

```typescript
describe('ProductService', () => {
  it('should return top products correctly', () => {
    const products = [
      { id: 1, name: 'Product A', status: 'active', stock: 10, sales: 100 },
      { id: 2, name: 'Product B', status: 'inactive', stock: 5, sales: 200 },
      { id: 3, name: 'Product C', status: 'active', stock: 0, sales: 150 },
      { id: 4, name: 'Product D', status: 'active', stock: 20, sales: 50 },
    ]

    const filter = new CollectionFilter(products)
    const criteria = new TopProductCriteria({ limit: 2 })

    const result = filter.findAll(criteria)

    // Solo Product A y D (activos con stock), ordenados por ventas
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(1) // 100 ventas
    expect(result[1].id).toBe(4) // 50 ventas
  })
})
```

Sin mocks de base de datos, sin setup complicado. Solo datos y lógica.

---

## 5. El Repository: uniendo todo

Finalmente, el repositorio queda limpio y simple:

```typescript
// ProductRepository.ts
import { Criteria } from './Criteria'
import { Product } from './models/Product'

export class ProductRepository {
  constructor(
    private readonly transformer: CriteriaTransformer<any>,
    private readonly tableName: string = 'products'
  ) {}

  async find(criteria: Criteria): Promise<Product[]> {
    const query = this.transformer.transform(criteria, this.tableName)
    // Ejecutar query...
    return []
  }

  async count(criteria: Criteria): Promise<number> {
    // Similar pero con COUNT
    return 0
  }

  async exists(criteria: Criteria): Promise<boolean> {
    const count = await this.count(criteria)
    return count > 0
  }
}
```

Un solo método `find()` que acepta cualquier `Criteria`. Adiós a los 20 métodos `findByX`.

---

## 6. Tipado y seguridad reales: transformador a Drizzle

Hasta aquí el patrón está completo, pero hay una pieza que en la mayoría de los artículos sobre Criteria queda fuera y que en producción es la más importante: **el tipado y la seguridad de los campos**.

Volvamos al problema. Nuestro `Filter` define `field: string`. Eso significa que **cualquier string** es un campo válido para filtrar u ordenar. Y si el `Criteria` se construye a partir de la petición HTTP —que es el caso de uso real del patrón— entonces el cliente decide qué campos consultar. Eso abre dos agujeros:

1. **Inyección.** Como vimos en la sección 3, concatenar `field` en un string SQL es inyección directa.
2. **Sobreexposición de datos.** Aunque parametrices los valores, si no restringes los nombres de campo, el cliente puede filtrar u ordenar por columnas que nunca quisiste exponer (`passwordHash`, `internalScore`, flags de feature, etc.) e inferir información de la base mediante respuestas.

El tipado no es solo comodidad de autocompletado: **es la mitigación del agujero**. Cuando los campos permitidos están declarados en un mapa de columnas reales, un campo arbitrario simplemente no existe en el mapa, y la consulta falla de forma controlada en vez de ejecutarse.

[Drizzle ORM](https://orm.drizzle.team/) encaja con Criteria mucho mejor que un constructor de strings, por una razón estructural: sus operadores (`eq`, `gt`, `like`, `and`, `or`, …) son **funciones que devuelven condiciones componibles de primera clase**, no fragmentos de texto. Eso convierte el transformador en, básicamente, un `map` sobre los filtros. Además, Drizzle **parametriza** los valores por debajo, así que la inyección por valor desaparece.

### El allowlist tipado

La pieza central es un mapa que asocia los nombres de campo _públicos_ del Criteria con las columnas _reales_ de Drizzle. Solo lo declarado aquí es filtrable u ordenable:

```typescript
// products.schema.ts
import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  status: text('status').notNull(),
  sales: integer('sales').notNull(),
  rating: integer('rating'),
})
```

```typescript
// CriteriaToDrizzleTransformer.ts
import {
  and,
  or,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  inArray,
  like,
  asc,
  desc,
  type Column,
  type SQL,
} from 'drizzle-orm'
import {
  Criteria,
  CriteriaFilter,
  Filter,
  CompositeFilter,
  Operator,
} from './Criteria'

/**
 * Mapa de campos permitidos: nombre público del Criteria -> columna real de Drizzle.
 * Actúa como allowlist. Lo que no esté aquí, no se puede filtrar ni ordenar.
 */
export type FieldMap = Record<string, Column>

/**
 * Tabla de operadores -> constructores de condición de Drizzle.
 * Centralizar esto evita el `switch` disperso y deja explícito qué operadores existen.
 */
const OPERATOR_BUILDERS: Record<Operator, (column: Column, value: any) => SQL> =
  {
    '=': (c, v) => eq(c, v),
    '!=': (c, v) => ne(c, v),
    '>': (c, v) => gt(c, v),
    '>=': (c, v) => gte(c, v),
    '<': (c, v) => lt(c, v),
    '<=': (c, v) => lte(c, v),
    IN: (c, v) => inArray(c, Array.isArray(v) ? v : [v]),
    LIKE: (c, v) => like(c, `%${v}%`),
  }

export class CriteriaToDrizzleTransformer {
  constructor(private readonly fieldMap: FieldMap) {}

  /**
   * Resuelve un nombre de campo público a su columna real.
   * Si el campo no está en el allowlist, lanza error: este es el punto
   * donde un campo arbitrario del exterior se convierte en un fallo
   * controlado en lugar de una consulta peligrosa.
   */
  private resolveColumn(field: string): Column {
    const column = this.fieldMap[field]
    if (!column) {
      throw new Error(`Campo no permitido para filtrar/ordenar: "${field}"`)
    }
    return column
  }

  private isComposite(f: CriteriaFilter): f is CompositeFilter {
    return 'filters' in f
  }

  private buildCondition(f: CriteriaFilter): SQL {
    if (this.isComposite(f)) {
      const inner = f.filters.map((sub) => this.buildCondition(sub))
      // and()/or() de Drizzle aceptan condiciones y devuelven una nueva condición
      const combined = f.operator === 'AND' ? and(...inner) : or(...inner)
      // and()/or() pueden devolver undefined si reciben lista vacía; lo normalizamos
      if (!combined) {
        throw new Error('Filtro compuesto sin condiciones')
      }
      return combined
    }

    const simple = f as Filter
    const column = this.resolveColumn(simple.field)
    const builder = OPERATOR_BUILDERS[simple.operator]
    if (!builder) {
      throw new Error(`Operador no soportado: ${simple.operator}`)
    }
    return builder(column, simple.value)
  }

  /**
   * Devuelve las piezas que la query de Drizzle necesita: la condición WHERE,
   * el ORDER BY, y limit/offset. No ejecuta nada: eso es trabajo del repositorio.
   */
  transform(criteria: Criteria): {
    where?: SQL
    orderBy: SQL[]
    limit?: number
    offset?: number
  } {
    const filters = criteria.getFilters()

    let where: SQL | undefined
    if (filters.length === 1) {
      where = this.buildCondition(filters[0])
    } else if (filters.length > 1) {
      // Varios filtros de nivel superior se combinan con AND, igual que en el resto del artículo
      where = and(...filters.map((f) => this.buildCondition(f)))
    }

    const orderBy: SQL[] = criteria.getOrders().map((o) => {
      const column = this.resolveColumn(o.field)
      return o.direction === 'ASC' ? asc(column) : desc(column)
    })

    return {
      where,
      orderBy,
      limit: criteria.getLimit(),
      offset: criteria.getOffset(),
    }
  }
}
```

### El repositorio con Drizzle

Ahora el repositorio ejecuta esas piezas. Fíjate en que ya no maneja strings ni nombres de tabla sueltos: trabaja con la tabla tipada de Drizzle.

```typescript
// DrizzleProductRepository.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Criteria } from './Criteria'
import {
  CriteriaToDrizzleTransformer,
  FieldMap,
} from './CriteriaToDrizzleTransformer'
import { products } from './products.schema'

// El allowlist se declara una sola vez, junto a la tabla. Solo estos campos
// son consultables desde el exterior, aunque la tabla tenga más columnas.
const PRODUCT_FIELDS: FieldMap = {
  id: products.id,
  name: products.name,
  category: products.category,
  price: products.price,
  stock: products.stock,
  status: products.status,
  sales: products.sales,
  rating: products.rating,
}

export class DrizzleProductRepository {
  private readonly transformer = new CriteriaToDrizzleTransformer(
    PRODUCT_FIELDS
  )

  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async find(criteria: Criteria) {
    const { where, orderBy, limit, offset } =
      this.transformer.transform(criteria)

    let query = this.db.select().from(products).$dynamic()

    if (where) query = query.where(where)
    if (orderBy.length > 0) query = query.orderBy(...orderBy)
    if (limit !== undefined) query = query.limit(limit)
    if (offset !== undefined) query = query.offset(offset)

    return query
  }
}
```

Lo que ganamos respecto al string SQL de la sección 3:

- **Sin inyección por valor.** Drizzle parametriza: el `value` de cada filtro viaja como parámetro, nunca como texto interpolado.
- **Sin inyección por campo.** `resolveColumn` rechaza cualquier nombre que no esté en el allowlist, antes de tocar la base.
- **Sin sobreexposición.** Aunque `products` tenga columnas internas, solo las declaradas en `PRODUCT_FIELDS` son consultables.
- **Tipado donde importa.** `OPERATOR_BUILDERS` está tipado contra `Operator`, así que si añades un operador nuevo al `Criteria` y olvidas implementarlo, el compilador te avisa.

### El borde que el tipado no cubre (y hay que aceptar)

Seamos honestos sobre el límite: el `fieldMap` es un `Record<string, Column>` y el `field` del `Criteria` sigue siendo un `string` libre. TypeScript **no** puede garantizar en tiempo de compilación que un `field` cualquiera exista en el mapa, porque ese `field` nace de datos en tiempo de ejecución (la petición HTTP). Por eso `resolveColumn` valida en runtime y lanza error.

Esto es inherente al patrón Criteria, no una carencia de Drizzle: en el momento en que aceptas filtros dinámicos desde el exterior, la validación _tiene_ que ocurrir en runtime. Lo que el tipado sí te da es que el lado interno —el catálogo de operadores, las columnas, la construcción de condiciones— está verificado por el compilador, y que el único punto de entrada de datos no confiables es uno solo, explícito y fácil de auditar: `resolveColumn`. Concentrar ahí toda la desconfianza es justo lo que quieres.

> Si quieres llevar el tipado más lejos, puedes tipar el `field` del `Criteria` como `keyof FieldMap` mediante genéricos (`Criteria<keyof typeof PRODUCT_FIELDS>`). Eso te da autocompletado y verificación cuando construyes criterios _en el código_. Pero en cuanto el Criteria se arma a partir de un DTO de la petición, vuelves a `string` y necesitas la validación en runtime de todos modos. Mi recomendación: valida siempre en runtime y usa los genéricos solo como ayuda ergonómica para los criterios escritos a mano.

---

## Poniendo todo junto

```typescript
// Crear criterios
const cheapProducts = new Criteria({
  filters: [{ field: 'price', operator: '<', value: 50 }]
});

const featuredProducts = new Criteria({
  filters: [{ field: 'featured', operator: '=', value: true }]
});

// Combinarlos
const cheapOrFeatured = Criteria.or(cheapProducts, featuredProducts);

// Usar con SQL (didáctico)
const sqlTransformer = new CriteriaToSqlTransformer();
const sqlQuery = sqlTransformer.transform(cheapOrFeatured, 'products');
// SELECT * FROM products WHERE (price < 50) OR (featured = true);

// Usar con MongoDB
const mongoTransformer = new CriteriaToMongoTransformer();
const { filter, options } = mongoTransformer.transform(cheapOrFeatured);
// filter: { $or: [{ price: { $lt: 50 } }, { featured: true }] }

// Usar con Drizzle (producción)
const repo = new DrizzleProductRepository(db);
const results = await repo.find(cheapOrFeatured);
// Parametrizado, con allowlist de campos y tipado en el lado interno

// Usar en memoria para tests
const products = [...]; // tus datos de prueba
const collectionFilter = new CollectionFilter(products);
const inMemoryResults = collectionFilter.findAll(cheapOrFeatured);
```

---

## Conclusión

El patrón Criteria transformó cómo estructuro el acceso a datos en mis proyectos. Las ventajas principales:

- **Un método en lugar de muchos**: `find(criteria)` reemplaza docenas de `findByX`
- **Criterios reutilizables**: la lógica de negocio queda encapsulada en clases
- **Agnóstico a la base de datos**: el mismo criterio funciona con SQL, MongoDB, Drizzle o arrays en memoria
- **Testing simple**: el `CollectionFilter` elimina la necesidad de mockear bases de datos
- **Composable**: combina criterios con AND/OR sin complicaciones

Pero hay una lección que aprendí en producción y que vale más que todas las anteriores: **un Criteria que acepta campos dinámicos sin un allowlist es una vulnerabilidad, no una feature.** La flexibilidad del patrón —que cualquier campo sea filtrable— es exactamente lo que un atacante aprovecha. Por eso el transformador a Drizzle de la sección 6 no es un lujo: es la versión del patrón que de verdad debería llegar a producción. Concentra la validación de datos no confiables en un único punto (`resolveColumn`), parametriza los valores y deja que el compilador verifique todo lo demás.

La inmutabilidad del `Criteria` evita bugs donde un criterio se modifica sin querer. El allowlist tipado evita algo peor: que tu flexibilidad se convierta en la puerta de entrada de un atacante.

Si estás cansado de mantener repositorios con métodos que se multiplican como conejos, dale una oportunidad a este patrón. Pero móntalo con el allowlist desde el día uno. Tu yo del futuro —y tu equipo de seguridad— te lo agradecerán.
