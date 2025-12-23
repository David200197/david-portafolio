---
title: 'Criteria Pattern: How I Stopped Creating findByX Methods for Every Query'
createAt: '2025-12-02'
updateAt: '2025-12-02'
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
6. Integration with a Repository

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

### SQL Transformer

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

// Use with SQL
const sqlTransformer = new CriteriaToSqlTransformer();
const sqlQuery = sqlTransformer.transform(cheapOrFeatured, 'products');
// SELECT * FROM products WHERE (price < 50) OR (featured = true);

// Use with MongoDB
const mongoTransformer = new CriteriaToMongoTransformer();
const { filter, options } = mongoTransformer.transform(cheapOrFeatured);
// filter: { $or: [{ price: { $lt: 50 } }, { featured: true }] }

// Use in-memory for tests
const products = [...]; // your test data
const collectionFilter = new CollectionFilter(products);
const results = collectionFilter.findAll(cheapOrFeatured);
```

---

## Conclusion

The Criteria pattern transformed how I structure data access in my projects. The main advantages:

- **One method instead of many**: `find(criteria)` replaces dozens of `findByX`
- **Reusable criteria**: business logic is encapsulated in classes
- **Database-agnostic**: the same criteria works with SQL, MongoDB, or in-memory arrays
- **Simple testing**: `CollectionFilter` eliminates the need to mock databases
- **Composable**: combine criteria with AND/OR without complications

The immutability of `Criteria` is key: it prevents bugs where a criteria gets accidentally modified somewhere in the code.

If you're tired of maintaining repositories with methods that multiply like rabbits, give this pattern a try. Your future self will thank you.
