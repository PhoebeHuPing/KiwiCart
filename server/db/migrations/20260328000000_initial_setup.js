/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. Create supermarkets table (base)
  await knex.schema.createTable('supermarkets', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('logo_url')
  })

  // 2. Create products table
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('category')
    table.string('image_url')
  })

  // 3. Create prices table (relational)
  await knex.schema.createTable('prices', (table) => {
    table.increments('id').primary()
    table.integer('product_id').references('products.id').onDelete('CASCADE')
    table.integer('supermarket_id').references('supermarkets.id').onDelete('CASCADE')
    table.decimal('price', 10, 2).notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('prices')
  await knex.schema.dropTableIfExists('products')
  await knex.schema.dropTableIfExists('supermarkets')
}
