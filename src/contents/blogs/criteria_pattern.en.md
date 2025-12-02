---
title: 'Criteria Pattern. Implementation in TypeScript with Repositories and Transformers'
createAt: '2025-12-02'
updateAt: '2025-12-02'
author: 'David Alfonso Pereira'
authorPhoto: 'https://avatars.githubusercontent.com/u/80176604?s=96&v=4'
authorPhotoAlt: 'David Alfonso'
tags: ['programming', 'patterns', 'repository']
description: 'In this article we will explore what the criteria pattern is using examples in TypeScript.'
image: '/david-portafolio/blogs/criteria_pattern.png'
---

# Criteria Pattern. Implementation in TypeScript with Repositories and Transformers

<img src='/david-portafolio/blogs/criteria_pattern.png' alt="JavaScript Logo" class="img-blog" />

If you have ever found yourself building complex queries in your application and wished for a **clean, reusable, and flexible** way to handle them, then the **Criteria pattern** is for you.

This pattern allows us to separate **business logic** from the **specific database implementation**, enabling us to:

- Apply dynamic and combinable filters
- Define sorting, limits, and offsets easily
- Transform criteria into different data sources (SQL, MongoDB, etc.)
- Create reusable and parameterizable criteria

> One of the biggest advantages of using the **Criteria pattern** within a **Repository** is that **we avoid having to create a new method for every type of search**. Thanks to parameterizable and combinable criteria, we can build complex queries flexibly, reusing the same data access infrastructure without multiplying specific methods.

In this article, we will see how to implement a complete Criteria system in **TypeScript**, including:

1. An **immutable base Criteria**
2. **Composite filters** (AND/OR)
3. **Reusable specialized criteria** (like `TopProductCriteria`)
4. **Transformers** for SQL and MongoDB
5. A static `join` method to combine criteria
6. How to integrate it with a **Repository**

---

## 1. Defining Types and the Base Criteria

First, we need to define the types we will use and our `Criteria` class:

```ts
// Criteria.ts
export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'IN' | 'LIKE'
export type LogicalOperator = 'AND' | 'OR'

export interface Filter {
  field: string
  operator: Operator
  value: any
}

export interface CompositeFilter {
  operator: LogicalOperator
  filters: (Filter | CompositeFilter)[]
}

export type CriteriaFilter = Filter | CompositeFilter

export interface Order {
  field: string
  direction: 'ASC' | 'DESC'
}

export interface CriteriaOptions {
  filters?: CriteriaFilter[]
  orders?: Order[]
  limit?: number
  offset?: number
}

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

  static join(
    criteriaArray: Criteria[],
    logicalOperator: LogicalOperator = 'AND'
  ): Criteria {
    const combinedFilters: CriteriaFilter[] = criteriaArray
      .map((c) => c.getFilters())
      .filter((f) => f.length > 0)
      .map((f) =>
        f.length === 1 ? f[0] : { operator: logicalOperator, filters: f }
      )

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

> Our `Criteria` class is **immutable**, meaning all its configuration is done through the constructor. Additionally, the `join` method allows us to combine multiple criteria using logical operators (`AND` or `OR`), which is very useful when building complex queries cleanly.

---

## 2. Specialized Criteria: TopProductCriteria

Sometimes we need **ready-to-use criteria** for specific business rules. For example, a criterion that returns the top-selling products:

```ts
// TopProductCriteria.ts
import { Criteria, Filter, Order } from './Criteria'

interface TopProductParams {
  limit?: number
  category?: string
}

export class TopProductCriteria extends Criteria {
  constructor(params: TopProductParams = {}) {
    const filters: Filter[] = [
      { field: 'status', operator: '=', value: 'active' },
    ]
    if (params.category) {
      filters.push({ field: 'category', operator: '=', value: params.category })
    }

    const orders: Order[] = [{ field: 'sales', direction: 'DESC' }]

    super({
      filters,
      orders,
      limit: params.limit ?? 10,
    })
  }
}
```

> With this, we can easily get the top-selling products, optionally filtered by category and with a configurable limit.

---

## 3. Transformers to SQL and MongoDB

The next step is converting our criteria into concrete queries for different databases.

### SQL Transformer

```ts
// CriteriaToSqlTransformer.ts
import { Criteria, CriteriaFilter, Filter, CompositeFilter } from './Criteria'

function filterToSql(f: CriteriaFilter): string {
  if ('field' in f) {
    const value = typeof f.value === 'string' ? `'${f.value}'` : f.value
    if (f.operator === 'IN' && Array.isArray(f.value)) {
      return `${f.field} IN (${f.value.map((v) => `'${v}'`).join(', ')})`
    }
    return `${f.field} ${f.operator} ${value}`
  } else {
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

    if (criteria.getLimit() !== undefined)
      query += ` LIMIT ${criteria.getLimit()}`
    if (criteria.getOffset() !== undefined)
      query += ` OFFSET ${criteria.getOffset()}`

    return query
  }
}
```

### MongoDB Transformer

```ts
// CriteriaToMongoTransformer.ts
import { Criteria, CriteriaFilter, Filter, CompositeFilter } from './Criteria'

function filterToMongo(f: CriteriaFilter): any {
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
        return { [f.field]: { $in: f.value } }
      case 'LIKE':
        return { [f.field]: { $regex: f.value, $options: 'i' } }
    }
  } else {
    const inner = f.filters.map(filterToMongo)
    return f.operator === 'AND' ? { $and: inner } : { $or: inner }
  }
}

export class CriteriaToMongoTransformer {
  transform(criteria: Criteria): { filter: any; options: any } {
    const filter = criteria.getFilters()
    const mongoFilter =
      filter.length > 0
        ? filter.length === 1
          ? filterToMongo(filter[0])
          : { $and: filter.map(filterToMongo) }
        : {}

    const options: any = {}
    const orders = criteria.getOrders()
    if (orders.length > 0) {
      options.sort = orders.reduce(
        (acc, o) => {
          acc[o.field] = o.direction === 'ASC' ? 1 : -1
          return acc
        },
        {} as Record<string, 1 | -1>
      )
    }

    if (criteria.getLimit() !== undefined) options.limit = criteria.getLimit()
    if (criteria.getOffset() !== undefined) options.skip = criteria.getOffset()

    return { filter: mongoFilter, options }
  }
}
```

---

## 4️⃣ Integrating with the Repository Pattern

The **Repository** allows us to encapsulate data access logic, keeping our queries independent of the specific database:

```ts
// ProductRepository.ts
import { Criteria } from './Criteria'
import { CriteriaToSqlTransformer } from './CriteriaToSqlTransformer'

export class ProductRepository {
  private tableName = 'products'
  private sqlTransformer = new CriteriaToSqlTransformer()

  find(criteria: Criteria): string {
    // Normally, you would execute the SQL query here
    // For simplicity, we just return the generated query
    return this.sqlTransformer.transform(criteria, this.tableName)
  }
}
```

### Using the Repository with Criteria

```ts
import { TopProductCriteria } from './TopProductCriteria'
import { Criteria } from './Criteria'
import { ProductRepository } from './ProductRepository'

const repository = new ProductRepository()

// Top 10 active products
const topProducts = new TopProductCriteria()
console.log(repository.find(topProducts))

// Top 5 products in the Electronics category
const topElectronics = new TopProductCriteria({
  limit: 5,
  category: 'Electronics',
})
console.log(repository.find(topElectronics))

// Combining criteria with OR
const combined = Criteria.join([topProducts, topElectronics], 'OR')
console.log(repository.find(combined))
```

---

## ✅ Conclusion

With this implementation, we achieve:

1. **Immutable and parameterizable Criteria**
2. **Simple and composite filters** (AND/OR and nested subfilters)
3. **Reusable specialized criteria** (`TopProductCriteria`)
4. **Transformers to SQL and MongoDB**, separating query construction from the database
5. **`join` method** to combine multiple criteria
6. **Integration with Repository**, keeping business logic clean and decoupled

> Additionally, **we don’t need to create a new method for every type of search**. This makes our repositories cleaner and more scalable, allowing new queries to be implemented simply by creating or combining criteria, without touching the repository class.

This approach makes your application **modular, testable, and flexible**
