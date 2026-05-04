import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import db from '../../server/db/connection.ts'
import * as dbFuncs from '../../server/db/index.ts'

beforeAll(async () => {
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run()
})

afterAll(async () => {
  await db.destroy()
})

describe('Database functions', () => {
  it('getProducts returns all products', async () => {
    const products = await dbFuncs.getProducts()
    expect(products).toHaveLength(3)
    expect(products[0]).toHaveProperty('name')
  })

  it('getComparePrices returns matched products with supermarket info', async () => {
    const results = await dbFuncs.getComparePrices('Apple')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].product_name).toContain('Apple')
    expect(results[0]).toHaveProperty('supermarket_name')
    expect(results[0]).toHaveProperty('price')
  })

  it('deleteProductById removes a product', async () => {
    await dbFuncs.deleteProductById(1)
    const products = await dbFuncs.getProducts()
    expect(products).toHaveLength(2)
  })
})
