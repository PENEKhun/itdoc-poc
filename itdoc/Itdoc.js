import supertest from "supertest";
import app from "../app";

// DSL Helper Functions
export const field = (description, example) => ({ description, example });
export const header = (name, description, example) => ({ name, description, example });

// 재귀적으로 expected 객체와 실제 응답을 검증하는 헬퍼 함수
const validateResponse = (expectedObj, actualObj, path = "") => {
  for (const key in expectedObj) {
    const currentPath = path ? `${path}.${key}` : key;
    const expectedVal = expectedObj[key];
    const actualVal = actualObj ? actualObj[key] : undefined;

    // expectedVal이 DSL field 객체인지 확인 ("example" 프로퍼티가 있다면)
    if (expectedVal && typeof expectedVal === "object" && "example" in expectedVal) {
      const expected = expectedVal.example;
      if (typeof expected === "function") {
        console.log(`Validating field "${currentPath}" with value:`, actualVal);
        expected(actualVal);
      } else {
        if (actualVal !== expected) {
          throw new Error(
            `Expected response body[${currentPath}] to be ${expected} but got ${actualVal}`
          );
        }
      }
    } else if (expectedVal && typeof expectedVal === "object") {
      // 중첩 객체라면 재귀 호출
      if (typeof actualVal !== "object") {
        throw new Error(
          `Expected response body[${currentPath}] to be an object but got ${actualVal}`
        );
      }
      validateResponse(expectedVal, actualVal, currentPath);
    } else {
      // 그냥 원시 값인 경우 직접 비교
      if (actualVal !== expectedVal) {
        throw new Error(
          `Expected response body[${currentPath}] to be ${expectedVal} but got ${actualVal}`
        );
      }
    }
  }
};

// 체인 빌더 클래스 (DSL)
class APITestBuilder {
  constructor(defaults = {}, method, url) {
    this.config = { ...defaults };
    this.method = method;
    this.url = url;
  }

  withPathParams(params) {
    this.config.pathParams = params;
    return this;
  }

  withQueryParams(params) {
    this.config.queryParams = params;
    return this;
  }

  withRequestBody(body) {
    this.config.requestBody = body;
    return this;
  }

  withoutHeader(headerName) {
    if (this.config.requestHeaders && this.config.requestHeaders[headerName]) {
      delete this.config.requestHeaders[headerName];
    } else {
      console.warn(`Header "${headerName}" not found`);
    }
    return this;
  }

  expectStatus(status) {
    this.config.expectedStatus = status;
    return this;
  }

  expectResponseBody(body) {
    this.config.expectedResponseBody = body;
    return this;
  }

  // prettyPrint 기능 활성화를 위한 메서드
  withPrettyPrint() {
    this.config.prettyPrint = true;
    return this;
  }

  async runTest() {
    // URL에 포함된 pathParams 치환
    let finalUrl = this.url;
    if (this.config.pathParams) {
      for (const [key, value] of Object.entries(this.config.pathParams)) {
        finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(value));
      }
    }

    // Supertest 요청 생성 (메소드에 따라 get, post 등 호출)
    const requestInstance = supertest(app);
    let req = requestInstance[this.method.toLowerCase()](finalUrl);

    // 요청 헤더 설정
    if (this.config.requestHeaders) {
      for (const [key, headerObj] of Object.entries(this.config.requestHeaders)) {
        req = req.set(key, headerObj.example);
      }
    }

    // 쿼리 파라미터 설정
    if (this.config.queryParams) {
      const queryParams = {};
      for (const [key, fieldObj] of Object.entries(this.config.queryParams)) {
        queryParams[key] = fieldObj.example;
      }
      req = req.query(queryParams);
    }

    // 요청 본문 설정
    if (this.config.requestBody) {
      const body = {};
      for (const [key, fieldObj] of Object.entries(this.config.requestBody)) {
        body[key] = fieldObj.example;
      }
      req = req.send(body);
    }

    // 응답 상태 코드 검증
    if (this.config.expectedStatus) {
      req = req.expect(this.config.expectedStatus);
    }

    // 응답 본문 검증: 재귀 함수를 이용해 중첩 객체까지 처리합니다.
    if (this.config.expectedResponseBody) {
      req = req.expect((res) => {
        validateResponse(this.config.expectedResponseBody, res.body);
      });
    }

    try {
      const res = await req;
      if (this.config.prettyPrint) {
        console.log("=== API TEST REQUEST ===");
        console.log("Method:", this.method);
        console.log("URL:", finalUrl);
        console.log("Headers:", JSON.stringify(this.config.requestHeaders, null, 2));
        console.log("Query Params:", JSON.stringify(this.config.queryParams, null, 2));
        console.log("Request Body:", JSON.stringify(this.config.requestBody, null, 2));
        console.log("=== API TEST RESPONSE ===");
        console.log("Status:", res.status);
        console.log("Response Body:", JSON.stringify(res.body, null, 2));
      }
      return res;
    } catch (error) {
      if (this.config.prettyPrint) {
        console.log("=== API TEST REQUEST (on Error) ===");
        console.log("Method:", this.method);
        console.log("URL:", finalUrl);
        console.log("Headers:", JSON.stringify(this.config.requestHeaders, null, 2));
        console.log("Query Params:", JSON.stringify(this.config.queryParams, null, 2));
        console.log("Request Body:", JSON.stringify(this.config.requestBody, null, 2));
        if (error.response) {
          console.log("=== API TEST RESPONSE (Error) ===");
          console.log("Status:", error.response.status);
          console.log("Response Body:", JSON.stringify(error.response.body, null, 2));
        } else {
          console.log("Error Message:", error.message);
        }
      }
      throw error;
    }
  }

  // thenable 구현: await 시 자동으로 runTest()를 호출하도록 구현
  then(resolve, reject) {
    return this.runTest().then(resolve, reject);
  }
}

// APIDoc 클래스
class APIDoc {
  constructor(method, url, options) {
    this.method = method;
    this.url = url;
    this.options = options;
  }

  test() {
    return new APITestBuilder(this.options.defaults, this.method, this.url);
  }
}

// Jest Wrapper DSL
export const describeAPI = (method, url, options, callback) => {
  if (!options.name) {
    throw new Error("API 이름이 필요합니다.");
  }

  describe(`${options.name} - ${method} ${url}`, () => {
    const apiDoc = new APIDoc(method, url, options);
    callback(apiDoc);
  });
};

export const itDoc = (description, testFn) => {
  it(description, async () => {
    await testFn();
  });
};
