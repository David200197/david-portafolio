---
title: 'Criteria Pattern. Implementation in TypeScript with Repositories and Transformers'
createAt: '2025-12-02'
updateAt: '2025-12-02'
author: 'David Alfonso Pereira'
authorPhoto: 'https://avatars.githubusercontent.com/u/80176604?s=96&v=4'
authorPhotoAlt: 'David Alfonso'
tags: ['programming', 'patterns', 'repository']
description: 'In this article, we explore what the criteria pattern is using examples in TypeScript'
image: '/david-portafolio/blogs/criteria_pattern.png'
---

# Criteria Pattern. Implementation in TypeScript with Repositories and Transformers

<img src='/david-portafolio/blogs/criteria_pattern.png' alt="JavaScript Logo" class="img-blog" />

If you've ever found yourself building complex queries in your application and wished for a **clean, reusable, and flexible** way to handle them, then the **Criteria Pattern** is for you.

This pattern allows us to separate **business logic** from the **specifics of the database**, making it possible to:

- Apply dynamic, combinable filters
- Define ordering, limits, and offsets easily
- Transform criteria to different data sources (SQL, MongoDB, etc.)
- Create reusable, parameterizable criteria

> One of the major advantages of using the **Criteria Pattern** within a **Repository** is that **we avoid having to create a new method for each type of search**. Thanks to parameterizable and combinable criteria, we can build complex queries flexibly, reusing the same data access infrastructure without multiplying specific methods.

In this article, we'll see how to implement a complete Criteria system in **TypeScript**, including:

1. An **immutable base Criteria** with full documentation
2. **Static AND and OR methods** for intuitive combination
3. **Reusable specialized criteria** (like `TopProductCriteria`)
4. **Transformers** for SQL and MongoDB
5. How to integrate it with a **Repository** using dependency injection
6. **Simplified testing** thanks to immutability

---

## 1. Defining the Types and the Base Criteria with Full Documentation

First, we establish the fundamental types with exhaustive documentation and our `Criteria` class:

```typescript
// Criteria.ts

/**
 * Available comparison operators for filters.
 */
export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'IN' | 'LIKE'

/**
 * Logical operators for combining filters.
 */
export type LogicalOperator = 'AND' | 'OR'

/**
 * Represents a simple filter on a field.
 */
export interface Filter {
  /**
   * Name of the field to filter.
   */
  field: string

  /**
   * Comparison operator to apply.
   */
  operator: Operator

  /**
   * Value to compare the field against.
   * For the 'IN' operator, this should be an array of values.
   */
  value: any
}

/**
 * Represents a composite filter that combines multiple filters with a logical operator.
 */
export interface CompositeFilter {
  /**
   * Logical operator to combine the internal filters.
   */
  operator: LogicalOperator

  /**
   * Array of filters that compose this composite filter.
   * Can contain both simple filters and composite filters.
   */
  filters: (Filter | CompositeFilter)[]
}

/**
 * Type representing any filter, simple or composite.
 */
export type CriteriaFilter = Filter | CompositeFilter

/**
 * Represents result ordering.
 */
export interface Order {
  /**
   * Name of the field to order by.
   */
  field: string

  /**
   * Ordering direction (ascending or descending).
   */
  direction: 'ASC' | 'DESC'
}

/**
 * Options for building a search criteria.
 */
export interface CriteriaOptions {
  /**
   * Filters to apply in the search.
   */
  filters?: CriteriaFilter[]

  /**
   * Orderings to apply to the results.
   */
  orders?: Order[]

  /**
   * Maximum number of results to return.
   */
  limit?: number

  /**
   * Number of results to skip (for pagination).
   */
  offset?: number
}

/**
 * Criteria class for building complex search queries with filters, ordering, pagination, and logical combinations.
 *
 * @example
 * // Create a simple criteria
 * const criteria = new Criteria({
 *   filters: [{ field: 'name', operator: '=', value: 'John' }],
 *   orders: [{ field: 'createdAt', direction: 'DESC' }],
 *   limit: 10
 * });
 *
 * @example
 * // Combine criteria with logical operators
 * const criteria1 = new Criteria({ filters: [{ field: 'age', operator: '>', value: 18 }] });
 * const criteria2 = new Criteria({ filters: [{ field: 'active', operator: '=', value: true }] });
 * const combined = Criteria.and(criteria1, criteria2);
 */
export class Criteria {
  private readonly filters: CriteriaFilter[]
  private readonly orders: Order[]
  private readonly limitValue?: number
  private readonly offsetValue?: number

  /**
   * Creates a new Criteria instance.
   *
   * @param options - Configuration options for the criteria
   */
  constructor(options: CriteriaOptions = {}) {
    this.filters = options.filters ?? []
    this.orders = options.orders ?? []
    this.limitValue = options.limit
    this.offsetValue = options.offset
  }

  /**
   * Returns all filters defined in this criteria.
   *
   * @returns Array of filters (simple or composite)
   */
  getFilters(): CriteriaFilter[] {
    return this.filters
  }

  /**
   * Returns all orderings defined in this criteria.
   *
   * @returns Array of order specifications
   */
  getOrders(): Order[] {
    return this.orders
  }

  /**
   * Returns the limit value for pagination.
   *
   * @returns The limit value or undefined if not set
   */
  getLimit(): number | undefined {
    return this.limitValue
  }

  /**
   * Returns the offset value for pagination.
   *
   * @returns The offset value or undefined if not set
   */
  getOffset(): number | undefined {
    return this.offsetValue
  }

  /**
   * Combines multiple criteria using the AND logical operator.
   *
   * @remarks
   * The resulting criteria will have:
   * - All filters combined with AND operator
   * - All orders from all criteria (duplicates may be overridden)
   * - The first non-undefined limit from the criteria (if any)
   * - The first non-undefined offset from the criteria (if any)
   *
   * @note The immutability of Criteria guarantees thread safety and predictability in concurrent applications
   *
   * @param criteriaArray - One or more Criteria instances to combine
   * @returns A new Criteria instance with combined filters using AND operator
   *
   * @example
   * const criteria1 = new Criteria({ filters: [{ field: 'age', operator: '>', value: 18 }] });
   * const criteria2 = new Criteria({ filters: [{ field: 'active', operator: '=', value: true }] });
   * const combined = Criteria.and(criteria1, criteria2);
   * // Equivalent to: age > 18 AND active = true
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
   * Combines multiple criteria using the OR logical operator.
   *
   * @remarks
   * The resulting criteria will have:
   * - All filters combined with OR operator
   * - All orders from all criteria (duplicates may be overridden)
   * - The first non-undefined limit from the criteria (if any)
   * - The first non-undefined offset from the criteria (if any)
   *
   * @param criteriaArray - One or more Criteria instances to combine
   * @returns A new Criteria instance with combined filters using OR operator
   *
   * @example
   * const criteria1 = new Criteria({ filters: [{ field: 'role', operator: '=', value: 'admin' }] });
   * const criteria2 = new Criteria({ filters: [{ field: 'role', operator: '=', value: 'moderator' }] });
   * const combined = Criteria.or(criteria1, criteria2);
   * // Equivalent to: role = 'admin' OR role = 'moderator'
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

> Our `Criteria` class is **immutable**, which guarantees thread safety and predictability in concurrent applications. The static methods `and()` and `or()` provide a more intuitive and fluent API for combining criteria. Additionally, exhaustive documentation improves the development experience and autocompletion in IDEs.

---

## 2. Specialized Criteria: TopProductCriteria with Optional Parameters

We create reusable criteria based on specific business rules:

```typescript
// TopProductCriteria.ts
import { Criteria, Filter, Order } from './Criteria'

/**
 * Criteria for retrieving top-selling products with optional filtering by category.
 *
 * @example
 * // Top 10 active products by sales
 * const topProducts = new TopProductCriteria();
 *
 * @example
 * // Top 5 active products in Electronics category
 * const topElectronics = new TopProductCriteria({
 *   limit: 5,
 *   category: 'Electronics'
 * });
 */
export class TopProductCriteria extends Criteria {
  constructor(params: { limit?: number; category?: string } = {}) {
    const filters: Filter[] = [
      { field: 'status', operator: '=', value: 'active' },
      { field: 'stock', operator: '>', value: 0 }, // Only products in stock
    ]

    if (params.category) {
      filters.push({ field: 'category', operator: '=', value: params.category })
    }

    const orders: Order[] = [
      { field: 'sales', direction: 'DESC' },
      { field: 'rating', direction: 'DESC' }, // Secondary ordering by rating
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

> With `TopProductCriteria` we can obtain best-selling products with optional filters by category. Extending `Criteria` allows us to reuse all existing infrastructure.

---

## 3. Enhanced Transformers to SQL and MongoDB

### SQL Transformer with Safe Type Handling

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

/**
 * Transforms Criteria objects into SQL queries with proper escaping and formatting.
 */
export class CriteriaToSqlTransformer {
  /**
   * Transforms a Criteria into a SQL SELECT query.
   *
   * @param criteria - The criteria to transform
   * @param tableName - Name of the table to query
   * @returns A complete SQL SELECT statement
   */
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

### MongoDB Transformer with More Specific Types

```typescript
// CriteriaToMongoTransformer.ts
import { Criteria, CriteriaFilter } from './Criteria'

type MongoFilter = Record<string, any>

function filterToMongo(f: CriteriaFilter): MongoFilter {
  if ('field' in f) {
    // Simple filter
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
    // Composite filter
    const inner = f.filters.map(filterToMongo)
    return f.operator === 'AND' ? { $and: inner } : { $or: inner }
  }
}

export interface MongoQueryOptions {
  sort?: Record<string, 1 | -1>
  limit?: number
  skip?: number
}

/**
 * Transforms Criteria objects into MongoDB query documents and options.
 */
export class CriteriaToMongoTransformer {
  /**
   * Transforms a Criteria into MongoDB query format.
   *
   * @param criteria - The criteria to transform
   * @returns Object containing filter and options for MongoDB queries
   */
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

## 4. Integration with Repository using Dependency Injection

We create an interface for the transformers and a generic repository:

```typescript
// interfaces/CriteriaTransformer.ts
import { Criteria } from '../Criteria'

/**
 * Interface for criteria transformers to different query languages/databases.
 */
export interface CriteriaTransformer<T> {
  transform(criteria: Criteria): T
}

/**
 * SQL transformer interface
 */
export interface SqlTransformer extends CriteriaTransformer<string> {
  transform(criteria: Criteria, tableName: string): string
}

/**
 * MongoDB transformer interface
 */
export interface MongoTransformer
  extends CriteriaTransformer<{
    filter: Record<string, any>
    options: Record<string, any>
  }> {}
```

```typescript
// ProductRepository.ts
import { Criteria } from './Criteria'
import { CriteriaTransformer } from './interfaces/CriteriaTransformer'
import { Product } from './models/Product'

/**
 * Generic repository for Product entities with criteria-based search.
 */
export class ProductRepository {
  /**
   * Creates a new ProductRepository.
   *
   * @param transformer - Transformer for converting criteria to database queries
   * @param tableName - Database table/collection name (default: 'products')
   */
  constructor(
    private readonly transformer: CriteriaTransformer<any>,
    private readonly tableName: string = 'products'
  ) {}

  /**
   * Finds products matching the given criteria.
   *
   * @param criteria - Search criteria to apply
   * @returns Promise resolving to array of matching products
   *
   * @example
   * const repository = new ProductRepository(new CriteriaToSqlTransformer());
   * const criteria = new TopProductCriteria({ limit: 5 });
   * const products = await repository.find(criteria);
   */
  async find(criteria: Criteria): Promise<Product[]> {
    try {
      // Transform criteria to database-specific query
      const query = this.transformer.transform(criteria, this.tableName)

      // In a real implementation, this would execute the query
      // For example: await database.query(query);
      console.log('Executing query:', query)

      // Mock implementation - return empty array
      return []
    } catch (error) {
      console.error('Error executing criteria query:', error)
      throw new Error(`Failed to execute criteria query: ${error.message}`)
    }
  }

  /**
   * Counts products matching the given criteria.
   *
   * @param criteria - Search criteria to apply
   * @returns Promise resolving to count of matching products
   */
  async count(criteria: Criteria): Promise<number> {
    // Similar implementation for counting
    return 0
  }

  /**
   * Checks if any product matches the given criteria.
   *
   * @param criteria - Search criteria to apply
   * @returns Promise resolving to boolean indicating existence
   */
  async exists(criteria: Criteria): Promise<boolean> {
    const count = await this.count(criteria)
    return count > 0
  }
}
```

---

## 5. Complete Usage with Practical Examples

```typescript
// examples/ProductSearch.ts
import { Criteria } from '../Criteria'
import { TopProductCriteria } from '../TopProductCriteria'
import { CriteriaToSqlTransformer } from '../CriteriaToSqlTransformer'
import { CriteriaToMongoTransformer } from '../CriteriaToMongoTransformer'
import { ProductRepository } from '../ProductRepository'

async function demonstrateCriteriaUsage() {
  // Example 1: Basic criteria usage
  console.log('=== Example 1: Basic Criteria ===')
  const basicCriteria = new Criteria({
    filters: [
      { field: 'price', operator: '<', value: 100 },
      { field: 'category', operator: '=', value: 'Electronics' },
    ],
    orders: [{ field: 'price', direction: 'ASC' }],
    limit: 20,
    offset: 0,
  })

  // Example 2: Specialized criteria
  console.log('\n=== Example 2: Top Products ===')
  const topProducts = new TopProductCriteria()
  const topElectronics = new TopProductCriteria({
    limit: 5,
    category: 'Electronics',
  })

  // Example 3: Combining criteria
  console.log('\n=== Example 3: Combined Criteria ===')
  const cheapCriteria = new Criteria({
    filters: [{ field: 'price', operator: '<', value: 50 }],
  })

  const featuredCriteria = new Criteria({
    filters: [{ field: 'featured', operator: '=', value: true }],
  })

  // Find products that are cheap OR featured
  const cheapOrFeatured = Criteria.or(cheapCriteria, featuredCriteria)

  // Find products that are cheap AND in Electronics
  const cheapElectronics = Criteria.and(
    cheapCriteria,
    new Criteria({
      filters: [{ field: 'category', operator: '=', value: 'Electronics' }],
    })
  )

  // Example 4: Repository usage with different transformers
  console.log('\n=== Example 4: Repository Examples ===')

  // SQL Repository
  const sqlRepository = new ProductRepository(new CriteriaToSqlTransformer())
  console.log('SQL Query for top electronics:')
  const sqlQuery = sqlRepository.find(topElectronics)

  // MongoDB Repository
  const mongoTransformer = new CriteriaToMongoTransformer()
  const mongoRepository = new ProductRepository({
    transform: (criteria: Criteria) => mongoTransformer.transform(criteria),
  } as any)

  console.log('\nMongoDB Query for cheap or featured:')
  const mongoQuery = mongoRepository.find(cheapOrFeatured)

  // Example 5: Complex nested filters
  console.log('\n=== Example 5: Complex Nested Filters ===')
  const complexCriteria = new Criteria({
    filters: [
      {
        operator: 'OR',
        filters: [
          { field: 'status', operator: '=', value: 'active' },
          { field: 'status', operator: '=', value: 'pending' },
        ],
      },
      {
        operator: 'AND',
        filters: [
          { field: 'stock', operator: '>', value: 0 },
          {
            operator: 'OR',
            filters: [
              { field: 'discount', operator: '>', value: 0 },
              { field: 'featured', operator: '=', value: true },
            ],
          },
        ],
      },
    ],
  })

  console.log('Complex criteria demonstrates nested AND/OR logic')
}

// Example 6: Testing made easy
console.log('\n=== Example 6: Testing Benefits ===')
// Criteria objects are simple, serializable data structures
const testCriteria = new TopProductCriteria({ limit: 3 })
console.log('Test criteria:', {
  filters: testCriteria.getFilters(),
  orders: testCriteria.getOrders(),
  limit: testCriteria.getLimit(),
})
// Easy to mock and assert in unit tests

demonstrateCriteriaUsage()
```

---

## 6. Testing Benefits with the Criteria Pattern

The Criteria Pattern greatly simplifies unit testing:

```typescript
// tests/ProductService.test.ts
import { ProductService } from '../ProductService'
import { TopProductCriteria } from '../TopProductCriteria'

describe('ProductService', () => {
  let productService: ProductService
  let mockRepository: any

  beforeEach(() => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
    }
    productService = new ProductService(mockRepository)
  })

  test('getTopProducts creates correct criteria', async () => {
    const limit = 5
    const category = 'Electronics'

    await productService.getTopProducts(limit, category)

    // Verify the repository was called with correct criteria
    expect(mockRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        getLimit: expect.any(Function),
        getFilters: expect.any(Function),
      })
    )

    // Or more specifically
    const calledCriteria = mockRepository.find.mock.calls[0][0]
    expect(calledCriteria.getLimit()).toBe(limit)
    expect(calledCriteria.getFilters()).toContainEqual(
      expect.objectContaining({
        field: 'category',
        operator: '=',
        value: category,
      })
    )
  })
})
```

---

## Conclusion

With this enhanced implementation, we achieve:

1. **Immutable, well-documented Criteria** with static `and()` and `or()` methods for a more intuitive API
2. **Clear separation of responsibilities** between criteria construction and query execution
3. **Database-specific transformers** with safe type and value handling
4. **Repository with dependency injection** for maximum flexibility
5. **Reusable specialized criteria** that encapsulate business rules
6. **Simplified testing** thanks to criteria serialization as simple objects

> **Key advantage**: We eliminate the need to create specific repository methods for each type of query. Instead of `findByCategory()`, `findActiveProducts()`, `findTopSelling()`, etc., we have a single `find()` method that accepts any `Criteria`. This makes our code more maintainable, extensible, and testable.

The Criteria Pattern transforms complex queries into **first-class objects** that can be:

- **Combined** logically
- **Reused** in different contexts
- **Serialized** for caching or logging
- **Transformed** to different backends
- **Tested** in isolation

This TypeScript implementation provides complete **type safety**, **intelligent autocompletion**, and **development-time documentation**, making working with complex queries an enjoyable and productive development experience.
