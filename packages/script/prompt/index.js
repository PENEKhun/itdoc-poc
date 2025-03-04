function getCdocprompt(content) {
    return ` 
    다음의 테스트내용을 기반으로 다음의 인터페이스를 갖춘 함수를 출력해주세요. 오로지 자바스크립트파일로만 떨어져야 합니다. 
    테스트내용:
    ${content}
    인터페이스:
     - 테스트 함수: describeAPI는 API 문서 및 테스트 케이스를 정의하는 함수입니다.
     - 테스트 케이스 함수: itDoc은 각 세부 테스트 시나리오를 기술하며, 테스트 실행을 위한 설정을 포함합니다.
     - 테스트 실행: 각 테스트는 apiDoc.test()를 통해 실행되며, 메서드체이닝으로 withRequestBody()와 expectStatus()로 요청본문과 응답상태값 등을 수행합니다.  
    
    함수예시: 
    describeAPI(
      HttpMethod.POST,
      '/signup',
      {
        name: '회원가입 API',
        tag: 'Auth',
        summary: '사용자로부터 아이디와 패스워드를 받아 회원가입을 수행합니다.',
      },
      targetApp,
      function (apiDoc) {
        itDoc('회원가입 성공', async function () {
          await apiDoc
            .test()
            .withRequestBody({
              username: field('아이디', 'penekhun'),
              password: field('패스워드', 'P@ssw0rd123!@#'),
            })
            // .withPrettyPrint()
            .expectStatus(HttpStatus.CREATED);
        });
    
        itDoc('아이디를 입력하지 않으면 회원가입 실패한다.', async function () {
          await apiDoc
            .test()
            .withRequestBody({
              password: field('패스워드', 'P@ssw0rd123!@#'),
            })
            .expectStatus(HttpStatus.BAD_REQUEST)
            .expectResponseBody({
              error: 'username is required',
            });
        });
    
        itDoc('패스워드가 8자 이하면 회원가입 실패한다.', async function () {
          await apiDoc
            .test()
            .withRequestBody({
              username: field('아이디', 'penekhun'),
              password: field('패스워드', '1234567'),
            })
            .expectStatus(HttpStatus.BAD_REQUEST)
            .expectResponseBody({
              error: 'password must be at least 8 characters',
            });
        });
      }
    ); 
    `
}
  
module.exports = { getCdocprompt };
  