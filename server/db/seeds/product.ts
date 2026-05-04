import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('prices').del()
  await knex('products').del()
  await knex('supermarkets').del()

  await knex('supermarkets').insert([
    {
      id: 1,
      name: 'Woolworths',
      logo_url: '/images/woolworths.webp',
      address: 'Botany Town Centre, East Auckland',
      lat: -36.9322,
      lng: 174.9125,
    },
    {
      id: 2,
      name: 'New World',
      logo_url: '/images/new-world.webp',
      address: 'Albany, North Shore',
      lat: -36.7264,
      lng: 174.7044,
    },
    {
      id: 3,
      name: 'PaknSave',
      logo_url: '/images/pak-n-save.webp',
      address: 'Henderson, West Auckland',
      lat: -36.8819,
      lng: 174.6336,
    },
  ])

  await knex('products').insert([
    {
      id: 1,
      name: 'Red Apple',
      category: 'Produce',
      image_url: '/images/apple.webp',
    },
    {
      id: 2,
      name: 'Anchor Milk 2L',
      category: 'Dairy',
      image_url: '/images/milk.webp',
    },
    {
      id: 3,
      name: 'White Bread',
      category: 'Bakery',
      image_url: '/images/bread.webp',
    },
  ])

  await knex('prices').insert([
    // Apple
    { product_id: 1, supermarket_id: 1, price: 3.5 },
    { product_id: 1, supermarket_id: 2, price: 3.2 },
    { product_id: 1, supermarket_id: 3, price: 2.9 },

    // Milk
    { product_id: 2, supermarket_id: 1, price: 4.8 },
    { product_id: 2, supermarket_id: 2, price: 4.5 },
    { product_id: 2, supermarket_id: 3, price: 4.25 },

    // Bread
    { product_id: 3, supermarket_id: 1, price: 2.5 },
    { product_id: 3, supermarket_id: 2, price: 2.3 },
    { product_id: 3, supermarket_id: 3, price: 1.99 },
  ])
}
