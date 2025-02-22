import { describeAPI } from '../../lib/dsl/describeAPI.js';
// import app from '../express-stub/sampleApp.js';
import { HttpMethod } from '../../lib/dsl/enums/HttpMethod.js';
import { itDoc } from '../../lib/dsl/itDoc.js';
// import { field } from '../../lib/dsl/apiTestHelper.js';
// import { HttpStatus } from '../../lib/dsl/enums/HttpStatus.js';

// const targetApp = app;

describeAPI(HttpMethod.POST, '/signup', {
  name: '회원가입 API',
  tag: 'Auth',
  summary: '회원가입을 수행합니다.'
}, () => {

  itDoc("회원가입 성공", async () => {
    // await apiDoc.test()
    //   .withRequestBody({
    //     username: field("아이디", "penek"),
    //     password: field("패스워드", "penek"),
    //   })
    //   .withPrettyPrint()
    //   .expectStatus(HttpStatus.NoContent);
  });
});
