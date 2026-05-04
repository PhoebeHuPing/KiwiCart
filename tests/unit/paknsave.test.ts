import { describe, it, expect, beforeEach } from 'vitest'
import nock from 'nock'
import { fetchPaknsavePrices } from '../../server/services/paknsave.ts'

describe('fetchPaknsavePrices', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('successfully fetches and formats prices', async () => {
    // Mock token request
    nock('https://www.paknsave.co.nz')
      .post('/api/user/get-current-user')
      .reply(200, { access_token: 'fake-token' })

    // Mock search request
    nock('https://api-prod.paknsave.co.nz')
      .post('/v1/edge/search/paginated/products')
      .reply(200, {
        products: [
          {
            productId: '123-abc',
            name: 'Test Milk',
            singlePrice: { price: 450 },
            images: { primaryImages: { '400px': 'img.jpg' } }
          }
        ]
      })

    const results = await fetchPaknsavePrices('Milk')

    expect(results).toHaveLength(1)
    expect(results[0].product_name).toBe('Test Milk')
    expect(results[0].price).toBe(4.5)
    expect(results[0].supermarket_name).toBe("Pak'nSave")
  })

  it('returns empty array on failure', async () => {
    nock('https://www.paknsave.co.nz')
      .post('/api/user/get-current-user')
      .reply(500)

    const results = await fetchPaknsavePrices('Milk')
    expect(results).toEqual([])
  })
})
