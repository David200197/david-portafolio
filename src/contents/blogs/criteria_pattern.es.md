---
title: 'Patrón Criteria. Implementación en TypeScript con Repositorios y Transformadores'
createAt: '2025-12-02'
updateAt: '2025-12-02'
author: 'David Alfonso Pereira'
authorPhoto: 'https://avatars.githubusercontent.com/u/80176604?s=96&v=4'
authorPhotoAlt: 'David Alfonso'
tags: ['programación', 'patrones', 'respositorio']
description: 'En este artículo exploramos qué es el patrón criteria usando ejemplos en typescript'
image: '/david-portafolio/blogs/criteria_pattern.png'
---

# Patrón Criteria. Implementación en TypeScript con Repositorios y Transformadores

<img src='/david-portafolio/blogs/criteria_pattern.png' alt="JavaScript Logo" class="img-blog" />

Si alguna vez te has encontrado construyendo consultas complejas en tu aplicación y deseaste tener una forma **limpia, reutilizable y flexible** de manejarlas, entonces el **patrón Criteria** es para ti.

Este patrón nos permite separar la **lógica de negocio** de la **forma específica de la base de datos**, haciendo posible:

- Aplicar filtros dinámicos y combinables
- Definir ordenamientos, límites y offsets de manera sencilla
- Transformar criterios a distintas fuentes de datos (SQL, MongoDB, etc.)
- Crear criterios reutilizables y parametrizables

> Una de las grandes ventajas de usar el **patrón Criteria** dentro de un **Repository** es que **evitamos tener que crear un método nuevo para cada tipo de búsqueda**. Gracias a los criterios parametrizables y combinables, podemos construir consultas complejas de manera flexible, reutilizando la misma infraestructura de acceso a datos sin multiplicar métodos específicos.

En este artículo, vamos a ver cómo implementar un sistema completo de Criteria en **TypeScript**, incluyendo:

1. Un **Criteria base inmutable**
2. **Filtros compuestos** (AND/OR)
3. **Criterios especializados reutilizables** (como `TopProductCriteria`)
4. **Transformadores** para SQL y MongoDB
5. Un método estático `join` para combinar criterios
6. Cómo integrarlo con un **Repository**

---

## 1. Definiendo los Tipos y el Criteria Base

Primero, necesitamos establecer los tipos que vamos a usar y nuestra clase `Criteria`:

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

> Nuestra clase `Criteria` es **inmutable**, lo que significa que toda su configuración se realiza a través del constructor. Además, el método `join` nos permite combinar múltiples criterios usando operadores lógicos (`AND` o `OR`), algo que será muy útil cuando queramos crear consultas complejas de forma limpia.

---

## 2. Criterio Especializado: TopProductCriteria

A veces necesitamos criterios **listos para usar** según reglas de negocio específicas. Por ejemplo, un criterio que devuelva los productos más vendidos:

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

> Con esto, podemos obtener fácilmente los productos más vendidos, opcionalmente filtrando por categoría y con un límite configurable.

---

## 3. Transformadores a SQL y MongoDB

El siguiente paso es convertir nuestros criterios en consultas concretas para distintas bases de datos.

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

## 4️⃣ Integrando con el Patrón Repository

El **Repository** nos permite encapsular la lógica de acceso a datos, manteniendo nuestras consultas independientes de la base de datos concreta:

```ts
// ProductRepository.ts
import { Criteria } from './Criteria'
import { CriteriaToSqlTransformer } from './CriteriaToSqlTransformer'

export class ProductRepository {
  private tableName = 'products'
  private sqlTransformer = new CriteriaToSqlTransformer()

  find(criteria: Criteria): string {
    // Aquí normalmente ejecutarías la consulta SQL
    // Por simplicidad, solo retornamos la consulta generada
    return this.sqlTransformer.transform(criteria, this.tableName)
  }
}
```

### Uso del Repository con Criteria

```ts
import { TopProductCriteria } from './TopProductCriteria'
import { Criteria } from './Criteria'
import { ProductRepository } from './ProductRepository'

const repository = new ProductRepository()

// Top 10 productos activos
const topProducts = new TopProductCriteria()
console.log(repository.find(topProducts))

// Top 5 productos de la categoría Electronics
const topElectronics = new TopProductCriteria({
  limit: 5,
  category: 'Electronics',
})
console.log(repository.find(topElectronics))

// Combinando criterios con OR
const combined = Criteria.join([topProducts, topElectronics], 'OR')
console.log(repository.find(combined))
```

---

## ✅ Conclusión

Con esta implementación logramos:

1. **Criteria inmutable y parametrizable**
2. **Filtros simples y compuestos** (AND/OR y subfiltros anidados)
3. **Criterios especializados reutilizables** (`TopProductCriteria`)
4. **Transformadores a SQL y MongoDB**, separando la construcción de la consulta de la base de datos
5. **Método `join`** para combinar criterios
6. **Integración con Repository**, manteniendo la lógica de negocio limpia y desacoplada

> Además, **no necesitamos crear un método nuevo por cada tipo de búsqueda**. Esto hace que nuestros repositorios sean más limpios y escalables, y permite que nuevas consultas se implementen simplemente creando o combinando criterios, sin tocar la clase del repositorio.

Este enfoque hace que tu aplicación sea **modular, testable y flexible**
