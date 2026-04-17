/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.table('supermarkets', (table) => {
    table.float('lat')
    table.float('lng')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.table('supermarkets', (table) => {
    table.dropColumn('lat')
    table.dropColumn('lng')
  })
}
