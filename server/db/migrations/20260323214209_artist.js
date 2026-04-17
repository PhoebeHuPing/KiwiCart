/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable('products', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('category')
      table.string('image_url')
    })
    .createTable('supermarkets', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('logo_url')
    })
    .createTable('prices', (table) => {
      table.increments('id').primary()
      table.integer('product_id').references('products.id').onDelete('CASCADE')
      table.integer('supermarket_id').references('supermarkets.id').onDelete('CASCADE')
      table.float('price')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema
    .dropTableIfExists('prices')
    .dropTableIfExists('products')
    .dropTableIfExists('supermarkets')
}
