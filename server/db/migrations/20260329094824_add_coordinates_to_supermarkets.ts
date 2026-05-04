import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('supermarkets', (table) => {
    table.float('lat')
    table.float('lng')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('supermarkets', (table) => {
    table.dropColumn('lat')
    table.dropColumn('lng')
  })
}
