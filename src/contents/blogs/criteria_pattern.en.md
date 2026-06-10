---
title: 'Criteria Pattern: How I Stopped Creating findByX Methods for Every Query'
createAt: '2025-12-02'
updateAt: '2026-06-10'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags: ['programming', 'patterns', 'repository']
description: 'In this article we explore what the Criteria pattern is and how to implement it in TypeScript to build flexible and reusable queries'
image: '/david-portafolio/blogs/criteria_pattern.webp'
---

# Criteria Pattern: How I Stopped Creating findByX Methods for Every Query

<img src='/david-portafolio/blogs/criteria_pattern.webp' alt="Criteria Pattern" class="img-blog" />

Have you ever started a project with a clean repository and, three months later, ended up with something like this?

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
  // ... and the list keeps growing
}
```

It happened to me. And honestly, it was a nightmare to maintain.

The **Criteria pattern** saved me from that mess. The idea is simple: instead of creating a method for every possible combination of filters, we create an object that describes _what_ we want to find, and let the repository handle the _how_.

## What are we building?

In this article we'll implement a complete Criteria system that includes:

1. An immutable base `Criteria` class
2. Methods to combine criteria with AND and OR
3. Reusable specialized criteria
4. Transformers for SQL and MongoDB
5. A filter for in-memory collections (super useful for testing)
6. A Drizzle transformer with real typing and security
7. Integration with a Repository

---

## 1. The Criteria class: the heart of the pattern

Let's start by defining the basic types. We need to represent filters, operators, and orderings:

```typescript
// Criteria.ts

/**
 * Available comparison operators
 */
export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'IN' | 'LIKE'

/**
 * Logical operators for combining filters
 */
export type LogicalOperator = 'AND' | 'OR'

/**
 * A simple filter on a field
 */
export interface Filter {
  field: string
  operator: Operator
  value: any
}

/**
 * A composite filter that combines multiple filters
 */
export interface CompositeFilter {
  operator: LogicalOperator
  filters: (Filter | CompositeFilter)[]
}

export type CriteriaFilter = Filter | CompositeFilter

/**
 * Result ordering
 */
export interface Order {
  field: string
  direction: 'ASC' | 'DESC'
}

/**
 * Options for building a Criteria
 */
export interface CriteriaOptions {
  filters?: CriteriaFilter[]
  orders?: Order[]
  limit?: number
  offset?: number
}
```

Now the `Criteria` class itself. I made it **immutable** on purpose: once you create a criteria, it doesn't change. This prevents subtle bugs when you pass the same criteria to multiple places.

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

The interesting part comes with the static methods for combining criteria. Instead of creating complicated logic inside each criteria, we simply combine them:

```typescript
  /**
   * Combines multiple criteria with AND
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
   * Combines multiple criteria with OR
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

## 2. Specialized criteria: encapsulating business rules

This is where the pattern starts to shine. Instead of having the "top selling products" logic scattered throughout the code, we encapsulate it in a class:

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

Now when someone on the team needs the top selling products, they just do:

```typescript
const topProducts = new TopProductCriteria()
const topElectronics = new TopProductCriteria({
  limit: 5,
  category: 'Electronics',
})
```

No need to check which filters to apply or copy code from somewhere else.

---

## 3. Transformers: the bridge to the database

The Criteria is database-agnostic. To execute it, we need to transform it to the language our database engine understands.

### SQL Transformer (teaching version, **do not use in production**)

Let's start with the most obvious version: building the SQL as a string. It's useful for _understanding_ the pattern, but below you'll see why it must not reach production as-is.

```typescript
// CriteriaToSqlTransformer.ts
import { Criteria, CriteriaFilter } from './Criteria'

function filterToSql(f: CriteriaFilter): string {
  if ('field' in f) {
    // Simple filter
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
    // Composite filter
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

> ⚠️ **Security warning.** This transformer escapes the _value_ (the single quotes), but it interpolates `f.field` and `f.operator` **raw** into the SQL string. And here's the core problem: the natural use case for Criteria is building dynamic filters from external input (query params, request body). That means `field` can come from the client. A `field` like `"1=1; DROP TABLE products; --"`, or a value crafted to escape the `LIKE` pattern, opens the door to **SQL injection**. Manually escaping quotes is precisely the anti-pattern that query parameters solve at the root.
>
> Never build SQL by concatenating identifiers or values that come from outside. Section 6 shows how to close this hole using an ORM that parameterizes and, on top of that, validates fields against the real schema.

### MongoDB Transformer

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
        throw new Error(`Unsupported operator: ${f.operator}`)
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

> 📝 **Note.** Mongo fares better than the SQL string because the driver treats values as data, not as code: the `LIKE` operator's `$regex` doesn't allow escaping into "another query" the way SQL concatenation does. But `f.field` is still an externally-supplied field name with no validation. An arbitrary field can expose data you never meant to filter on (say, an internal `passwordHash` field) or, with poorly sanitized Mongo operators, enable _NoSQL injection_. The same fix from section 6 — a field allowlist — applies here too.

---

## 4. CollectionFilter: Criteria for in-memory collections

This is a bonus that has been incredibly useful for me, especially for testing. Why mock a database when you can filter an array with the same API?

The idea is simple: we implement the same filtering, ordering, and pagination logic, but on JavaScript arrays.

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
    this.collection = [...collection] // Copy to avoid mutations
  }

  /**
   * Finds all elements matching the criteria
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
   * Finds a single element
   */
  findOne(criteria?: Criteria): T | undefined {
    const results = this.findAll(
      criteria ? new Criteria({ ...criteria, limit: 1 }) : undefined
    )
    return results[0]
  }

  /**
   * Counts how many elements match
   */
  count(criteria?: Criteria): number {
    if (!criteria) {
      return this.collection.length
    }
    return this.applyFilters(this.collection, criteria.getFilters()).length
  }

  /**
   * Checks if at least one element exists
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
   * Gets a field's value, supporting nested properties like 'profile.role'
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
          throw new Error('Value for IN must be an array')
        }
        return filterValue.includes(itemValue)
      case 'LIKE':
        if (typeof itemValue !== 'string' || typeof filterValue !== 'string') {
          return false
        }
        const pattern = filterValue.replace(/%/g, '.*').replace(/_/g, '.')
        return new RegExp(`^${pattern}$`, 'i').test(itemValue)
      default:
        throw new Error(`Unsupported operator: ${operator}`)
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

### Practical example of CollectionFilter

Let's see how to use it with real data:

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

// Find active users older than 21
const activeAdults = filter.findAll(
  new Criteria({
    filters: [
      { field: 'active', operator: '=', value: true },
      { field: 'age', operator: '>', value: 21 },
    ],
    orders: [{ field: 'age', direction: 'DESC' }],
  })
)
// Result: [Alice (35), John (25)]

// Find by department using nested properties
const itUsers = filter.findAll(
  new Criteria({
    filters: [{ field: 'profile.department', operator: '=', value: 'IT' }],
  })
)
// Result: [John, Bob]

// Find users whose name contains "Smith"
const smiths = filter.findAll(
  new Criteria({
    filters: [{ field: 'name', operator: 'LIKE', value: '%Smith%' }],
  })
)
// Result: [Jane Smith]

// Find users aged 20 or 35 using IN
const specificAges = filter.findAll(
  new Criteria({
    filters: [{ field: 'age', operator: 'IN', value: [20, 35] }],
  })
)
// Result: [Bob (20), Alice (35)]

// Composite filter: younger than 25 OR older than 30
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
// Result: [Bob (20), Alice (35)]
```

The best part of this approach is that **tests become trivial**:

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

    // Only Product A and D (active with stock), sorted by sales
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(1) // 100 sales
    expect(result[1].id).toBe(4) // 50 sales
  })
})
```

No database mocks, no complicated setup. Just data and logic.

---

## 5. The Repository: bringing it all together

Finally, the repository stays clean and simple:

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
    // Execute query...
    return []
  }

  async count(criteria: Criteria): Promise<number> {
    // Similar but with COUNT
    return 0
  }

  async exists(criteria: Criteria): Promise<boolean> {
    const count = await this.count(criteria)
    return count > 0
  }
}
```

A single `find()` method that accepts any `Criteria`. Goodbye to those 20 `findByX` methods.

---

## 6. Real typing and security: a Drizzle transformer

So far the pattern is complete, but there's a piece that most Criteria articles leave out and that in production is the most important one: **the typing and security of fields**.

Let's go back to the problem. Our `Filter` defines `field: string`. That means **any string** is a valid field to filter or order by. And if the `Criteria` is built from the HTTP request — which is the real use case for the pattern — then the client decides which fields to query. That opens two holes:

1. **Injection.** As we saw in section 3, concatenating `field` into a SQL string is direct injection.
2. **Data over-exposure.** Even if you parameterize the values, if you don't restrict field names, the client can filter or order by columns you never intended to expose (`passwordHash`, `internalScore`, feature flags, etc.) and infer database information through the responses.

Typing isn't just autocomplete convenience: **it's the mitigation for the hole**. When the allowed fields are declared in a map of real columns, an arbitrary field simply doesn't exist in the map, and the query fails in a controlled way instead of executing.

[Drizzle ORM](https://orm.drizzle.team/) fits Criteria far better than a string builder, for a structural reason: its operators (`eq`, `gt`, `like`, `and`, `or`, …) are **functions that return first-class composable conditions**, not text fragments. That turns the transformer into, basically, a `map` over the filters. On top of that, Drizzle **parameterizes** the values under the hood, so value injection disappears.

### The typed allowlist

The central piece is a map that associates the _public_ field names of the Criteria with the _real_ Drizzle columns. Only what's declared here is filterable or sortable:

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
 * Allowed-fields map: public Criteria name -> real Drizzle column.
 * Acts as an allowlist. Anything not here cannot be filtered or sorted.
 */
export type FieldMap = Record<string, Column>

/**
 * Operator -> Drizzle condition-builder table.
 * Centralizing this avoids the scattered `switch` and makes explicit
 * which operators exist.
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
   * Resolves a public field name to its real column.
   * If the field is not in the allowlist, it throws: this is the point
   * where an arbitrary external field becomes a controlled failure
   * instead of a dangerous query.
   */
  private resolveColumn(field: string): Column {
    const column = this.fieldMap[field]
    if (!column) {
      throw new Error(`Field not allowed for filtering/sorting: "${field}"`)
    }
    return column
  }

  private isComposite(f: CriteriaFilter): f is CompositeFilter {
    return 'filters' in f
  }

  private buildCondition(f: CriteriaFilter): SQL {
    if (this.isComposite(f)) {
      const inner = f.filters.map((sub) => this.buildCondition(sub))
      // Drizzle's and()/or() accept conditions and return a new condition
      const combined = f.operator === 'AND' ? and(...inner) : or(...inner)
      // and()/or() can return undefined if given an empty list; normalize it
      if (!combined) {
        throw new Error('Composite filter without conditions')
      }
      return combined
    }

    const simple = f as Filter
    const column = this.resolveColumn(simple.field)
    const builder = OPERATOR_BUILDERS[simple.operator]
    if (!builder) {
      throw new Error(`Unsupported operator: ${simple.operator}`)
    }
    return builder(column, simple.value)
  }

  /**
   * Returns the pieces the Drizzle query needs: the WHERE condition,
   * the ORDER BY, and limit/offset. It does not execute anything:
   * that's the repository's job.
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
      // Multiple top-level filters combine with AND, like everywhere else in the article
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

### The repository with Drizzle

Now the repository executes those pieces. Notice it no longer handles strings or loose table names: it works with Drizzle's typed table.

```typescript
// DrizzleProductRepository.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Criteria } from './Criteria'
import {
  CriteriaToDrizzleTransformer,
  FieldMap,
} from './CriteriaToDrizzleTransformer'
import { products } from './products.schema'

// The allowlist is declared once, next to the table. Only these fields
// are queryable from the outside, even if the table has more columns.
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

What we gain over the SQL string from section 3:

- **No value injection.** Drizzle parameterizes: each filter's `value` travels as a parameter, never as interpolated text.
- **No field injection.** `resolveColumn` rejects any name that isn't in the allowlist, before touching the database.
- **No over-exposure.** Even if `products` has internal columns, only those declared in `PRODUCT_FIELDS` are queryable.
- **Typing where it matters.** `OPERATOR_BUILDERS` is typed against `Operator`, so if you add a new operator to `Criteria` and forget to implement it, the compiler tells you.

### The edge that typing doesn't cover (and you have to accept)

Let's be honest about the limit: `fieldMap` is a `Record<string, Column>` and the `Criteria`'s `field` is still a free `string`. TypeScript **cannot** guarantee at compile time that an arbitrary `field` exists in the map, because that `field` is born from runtime data (the HTTP request). That's why `resolveColumn` validates at runtime and throws.

This is inherent to the Criteria pattern, not a Drizzle shortcoming: the moment you accept dynamic filters from the outside, validation _has_ to happen at runtime. What typing does give you is that the internal side — the operator catalog, the columns, the condition building — is compiler-verified, and that the only entry point for untrusted data is a single, explicit, easy-to-audit one: `resolveColumn`. Concentrating all the distrust there is exactly what you want.

> If you want to push typing further, you can type the `Criteria`'s `field` as `keyof FieldMap` via generics (`Criteria<keyof typeof PRODUCT_FIELDS>`). That gives you autocomplete and checking when you build criteria _in code_. But as soon as the Criteria is built from a request DTO, you're back to `string` and you need runtime validation anyway. My recommendation: always validate at runtime and use generics only as an ergonomic aid for hand-written criteria.

---

## Putting it all together

```typescript
// Create criteria
const cheapProducts = new Criteria({
  filters: [{ field: 'price', operator: '<', value: 50 }]
});

const featuredProducts = new Criteria({
  filters: [{ field: 'featured', operator: '=', value: true }]
});

// Combine them
const cheapOrFeatured = Criteria.or(cheapProducts, featuredProducts);

// Use with SQL (teaching)
const sqlTransformer = new CriteriaToSqlTransformer();
const sqlQuery = sqlTransformer.transform(cheapOrFeatured, 'products');
// SELECT * FROM products WHERE (price < 50) OR (featured = true);

// Use with MongoDB
const mongoTransformer = new CriteriaToMongoTransformer();
const { filter, options } = mongoTransformer.transform(cheapOrFeatured);
// filter: { $or: [{ price: { $lt: 50 } }, { featured: true }] }

// Use with Drizzle (production)
const repo = new DrizzleProductRepository(db);
const results = await repo.find(cheapOrFeatured);
// Parameterized, with a field allowlist and typing on the internal side

// Use in-memory for tests
const products = [...]; // your test data
const collectionFilter = new CollectionFilter(products);
const inMemoryResults = collectionFilter.findAll(cheapOrFeatured);
```

---

## Conclusion

The Criteria pattern transformed how I structure data access in my projects. The main advantages:

- **One method instead of many**: `find(criteria)` replaces dozens of `findByX`
- **Reusable criteria**: business logic is encapsulated in classes
- **Database-agnostic**: the same criteria works with SQL, MongoDB, Drizzle, or in-memory arrays
- **Simple testing**: `CollectionFilter` eliminates the need to mock databases
- **Composable**: combine criteria with AND/OR without complications

But there's one lesson I learned in production that's worth more than all the rest: **a Criteria that accepts dynamic fields without an allowlist is a vulnerability, not a feature.** The pattern's flexibility — that any field is filterable — is exactly what an attacker exploits. That's why the Drizzle transformer in section 6 isn't a luxury: it's the version of the pattern that should actually reach production. It concentrates untrusted-data validation in a single point (`resolveColumn`), parameterizes the values, and lets the compiler verify everything else.

The immutability of `Criteria` prevents bugs where a criteria gets accidentally modified. The typed allowlist prevents something worse: your flexibility turning into an attacker's entry point.

If you're tired of maintaining repositories with methods that multiply like rabbits, give this pattern a try. But build it with the allowlist from day one. Your future self — and your security team — will thank you.
