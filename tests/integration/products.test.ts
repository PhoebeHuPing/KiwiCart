import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import server from '../../server/server.ts'
import * as db from '../../server/db/index.ts'
import { fetchPaknsavePrices } from '../../server/services/paknsave.ts'
import { fetchNewWorldPrices } from '../../server/services/newworld.ts'

vi.mock('../../server/db/index.ts')
vi.mock('../../server/services/paknsave.ts')
vi.mock('../../server/services/newworld.ts')

describe('GET /api/v1/products', () => {
  it('should return a list of products from the database', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product', category: 'Test', image_url: 'test.jpg' }
    ]
    vi.mocked(db.getProducts).mockResolvedValue(mockProducts)

    const response = await request(server).get('/api/v1/products')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockProducts)
  })
})

describe('GET /api/v1/products/compare', () => {
  it('should return combined sorted results from DB and external services', async () => {
    const mockDbResults = [
      { product_name: 'Apple', price: 3.5, supermarket_name: 'Woolworths' }
    ]
    const mockPnsResults = [
      { product_name: 'Apple', price: 2.9, supermarket_name: 'PaknSave' }
    ]
    const mockNwResults = [
      { product_name: 'Apple', price: 3.2, supermarket_name: 'New World' }
    ]

    vi.mocked(db.getComparePrices).mockResolvedValue(mockDbResults as any)
    vi.mocked(fetchPaknsavePrices).mockResolvedValue(mockPnsResults)
    vi.mocked(fetchNewWorldPrices).mockResolvedValue(mockNwResults)

    const response = await request(server).get('/api/v1/products/compare?q=Apple')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
    expect(response.body[0].price).toBe(2.9)
    expect(response.body[2].price).toBe(3.5)
  })
})
