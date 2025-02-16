/**
 * @param { import("knex").Knex } knex
 */
export function up(knex) {
  return knex.schema.createTable("user_account", (table) => {
    table.bigIncrements("seqno").unsigned().primary();
    table.string("username", 20).notNullable();
    table.string("user_passwd", 400).notNullable();
    table.string("user_role", 40).notNullable();

    table.unique("username");
  });
}

/**
 * @param { import("knex").Knex } knex
 */
export async function down(knex) {
  return knex.schema.dropTable("user_account");
}
