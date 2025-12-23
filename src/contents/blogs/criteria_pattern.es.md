---
title: 'Patrón Criteria: Cómo dejé de crear métodos findByX para cada consulta'
createAt: '2025-12-02'
updateAt: '2025-12-02'
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
6. Integración con un Repository

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

### Transformador a SQL

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

// Usar con SQL
const sqlTransformer = new CriteriaToSqlTransformer();
const sqlQuery = sqlTransformer.transform(cheapOrFeatured, 'products');
// SELECT * FROM products WHERE (price < 50) OR (featured = true);

// Usar con MongoDB
const mongoTransformer = new CriteriaToMongoTransformer();
const { filter, options } = mongoTransformer.transform(cheapOrFeatured);
// filter: { $or: [{ price: { $lt: 50 } }, { featured: true }] }

// Usar en memoria para tests
const products = [...]; // tus datos de prueba
const collectionFilter = new CollectionFilter(products);
const results = collectionFilter.findAll(cheapOrFeatured);
```

---

## Conclusión

El patrón Criteria transformó cómo estructuro el acceso a datos en mis proyectos. Las ventajas principales:

- **Un método en lugar de muchos**: `find(criteria)` reemplaza docenas de `findByX`
- **Criterios reutilizables**: la lógica de negocio queda encapsulada en clases
- **Agnóstico a la base de datos**: el mismo criterio funciona con SQL, MongoDB o arrays en memoria
- **Testing simple**: el `CollectionFilter` elimina la necesidad de mockear bases de datos
- **Composable**: combina criterios con AND/OR sin complicaciones

La inmutabilidad del `Criteria` es clave: evita bugs donde un criterio se modifica sin querer en algún lugar del código.

Si estás cansado de mantener repositorios con métodos que se multiplican como conejos, dale una oportunidad a este patrón. Tu yo del futuro te lo agradecerá.
