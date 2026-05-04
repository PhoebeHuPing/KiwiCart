import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('supermarkets', (table) => {
    table.string('address')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('supermarkets', (table) => {
    table.dropColumn('address')
  })
}
