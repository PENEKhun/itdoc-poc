/**
 * 통합 테스트 종료 시 데이터베이스 컨테이너를 종료합니다.
 */
export default async () => {
  if (process.env.NODE_ENV !== "ci") {
    return;
  }

  console.log("테스트 DB 컨테이너를 종료합니다.");
  await globalThis.__TEST_DB_CONTAINER__.stop();
};
