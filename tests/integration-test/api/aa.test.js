import { describeAPI, field, header, itDoc } from "../../../itdoc/Itdoc.js";
import { HTTPStatus } from "../../../itdoc/HttpStatus.js";

describeAPI("POST", "/api/v1/users/login", {
  name: "사용자 로그인",
  tag: "auth",
  description: "아이디와 패스워드로 JWT 인증 토큰을 발급합니다.",
}, (apiDoc) => {
  itDoc("일치하는 아이디와 패스워드가 있다면 토큰을 발행한다.", async () => {
    await apiDoc.test()
      .withRequestBody({
        username: field("아이디", "penek"),
        password: field("패스워드", "penek"),
      })
      .withPrettyPrint() // prettyPrint 활성화
      .expectStatus(HTTPStatus.OK)
      .expectResponseBody({
        detail: {
          token: field("JWT 토큰 값", (value) => {
            if (typeof value !== "string" || value.length === 0) {
              throw new Error("Token is invalid or empty");
            }
            // JWT 포맷 (간단하게 검사)
            const jwtRegex = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/;
            if (!jwtRegex.test(value)) {
              throw new Error("Token does not match expected JWT format");
            }
          })
        }
      });
  });

  itDoc("일치하는 아이디와 패스워드가 없다면 401을 반환한다.", async () => {
    await apiDoc.test()
      .withRequestBody({
        username: field("아이디", "penek"),
        password: field("패스워드", "wrong-password"),
      })
      .expectStatus(HTTPStatus.UNAUTHORIZED)
      .expectResponseBody({
          message: field("에러 메시지", "없는 사용자거나 잘못된 패스워드입니다")
      });
  });
});
