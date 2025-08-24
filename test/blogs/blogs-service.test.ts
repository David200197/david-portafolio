import { TestBed } from '@suites/unit'
import { it, describe, beforeAll, expect } from 'vitest'
import { BlogService } from '@/modules/blogs/services/blog-service'

describe('BlogService', () => {
  let blogService: BlogService

  beforeAll(async () => {
    const { unit } = await TestBed.solitary(BlogService).compile()
    blogService = unit
  })

  it('should get a correct slugs', async () => {
    const slugs = await blogService.getAllSlugs()

    // Verificar que todos los elementos son strings
    slugs.forEach((slug) => {
      expect(typeof slug).toBe('string')
    })

    // Verificar que no hay valores duplicados
    const uniqueSlugs = new Set(slugs)
    expect(uniqueSlugs.size).toBe(slugs.length)
    expect(slugs.length > 0).toBe(true)
  })
})
