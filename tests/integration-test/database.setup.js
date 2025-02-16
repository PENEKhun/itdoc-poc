import { MySqlContainer } from "@testcontainers/mysql";
import Knex from "knex";

export default async () => {
  if (process.env.NODE_ENV !== "ci") {
    return;
  }

  console.log("테스트 DB 컨테이너를 시작합니다.");
  const testContainer = await new MySqlContainer()
    .withDatabase("gcloud")
    .start();
  console.log("테스트 DB 컨테이너 실행 완료");

  process.env.TEST_CONTAINER_DB_HOST = testContainer.getHost();
  process.env.TEST_CONTAINER_DB_PORT = "" + testContainer.getPort();
  process.env.TEST_CONTAINER_DB_USERNAME = testContainer.getUsername();
  process.env.TEST_CONTAINER_DB_PASSWORD = testContainer.getUserPassword();
  console.log("테스트 DB 컨테이너 환경변수 설정 완료");

  let dbConfig = {
    client: "mysql2",
    connection: {
      host: testContainer.getHost(),
      port: testContainer.getPort(),
      user: testContainer.getUsername(),
      password: testContainer.getUserPassword(),
      database: "gcloud",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  };

  console.log("테스트 DB 연결");
  const knex = Knex(dbConfig);
  console.log("테스트 DB 초기화");
  await knex.migrate.latest();
  await knex.seed.run();

  await knex.destroy();
  global.__TEST_DB_CONTAINER__ = testContainer; // for teardown
};
