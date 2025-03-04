
describeAPI(
  HttpMethod.POST,
  '/signup',
  {
    name: '회원가입 API',
    tag: 'Auth',
    summary: '사용자의 아이디와 패스워드를 받아 회원가입을 수행합니다.',
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
