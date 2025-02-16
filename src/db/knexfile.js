export default {
  test: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "root",
      database: "gcloud",
    },
  },
  ci: {
    client: "mysql2",
    connection: {
      /**
       * NOTE: username, password, port는 테스트환경에서 동적으로 설정됩니다.
       * @see `database.setup.js`
       */
      host: process.env.TEST_CONTAINER_DB_HOST,
      port: process.env.TEST_CONTAINER_DB_PORT,
      user: process.env.TEST_CONTAINER_DB_USERNAME,
      password: process.env.TEST_CONTAINER_DB_PASSWORD,
      database: "gcloud",
    },
  },
};
