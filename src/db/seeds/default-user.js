import UserAccount from "../models/user-account.js";

/**
 * @param { import("knex").Knex } knex
 */
export async function seed(knex) {
  await knex(UserAccount.tableName).insert([
    {
      seqno: 1,
      username: "admin",
      user_passwd:
        "$2a$12$I1DNHg.5PSsRp3TsYhdGAe3QKRKjRZwiNcbcK29e/ilX0NuDMnNJa",
      user_role: "ADMIN",
    },
    {
      seqno: 2,
      username: "penek",
      user_passwd:
        "$2a$12$mu876N4IynB3Bm6tyCkkmOzYgQdZjja0c4v5qpFHo5o2JHWj5UnnK",
      user_role: "USER",
    },
  ]);
}
