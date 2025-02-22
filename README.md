
- 사용자가 mocha 환경일 때
    - 잘 동작하는거 확인
- 사용자가 jest 환경일 때
    - 검토 필요 / 어떻게 검토하면 좋을지 생각해보기 (별도의 파이프라인으로 하기엔 너무 공수가 큼. 코드레벨에서 우선 검토)


- 임시로 지운 인터페이스들 다시 작성해두기
```typescript
import supertest, { name, Response, SuperTest, Test } from 'supertest';
import { HttpMethod } from './enums/HttpMethod.js';
import { HttpStatus } from './enums/HttpStatus.js';

/**
 * DSL Field 인터페이스
 * - example은 값 또는 값 검증 함수일 수 있습니다.
 */
export interface DSLField<T = any> {
    description: string;
    example: T | ((value: any) => void);
}

/**
 * DSL Header 타입 (field에 name 속성이 추가된 형태)
 */
export interface DSLHeader<T = any> extends DSLField<T> {
    name: string;
}

/**
 * DSL Helper Functions
 */
export const field = <T>(
    description: string,
    example: T | ((value: any) => void)
): DSLField<T> => ({ description, example });

export const header = <T>(
    name: string,
    description: string,
    example: T | ((value: any) => void)
): DSLHeader<T> => ({ name, description, example });

/**
 * 재귀적으로 expected 객체와 실제 응답을 검증하는 헬퍼 함수
 */
const validateResponse = (
    expectedObj: Record<string, any>,
    actualObj: Record<string, any> | undefined,
    path: string = ""
): void => {
    for (const key in expectedObj) {
        const currentPath = path ? `${path}.${key}` : key;
        const expectedVal = expectedObj[key];
        const actualVal = actualObj ? actualObj[key] : undefined;

        // DSL field 객체인지 ("example" 프로퍼티가 있다면) 확인
        if (
            expectedVal &&
            typeof expectedVal === "object" &&
            "example" in expectedVal
        ) {
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
            // 중첩 객체인 경우 재귀 호출
            if (typeof actualVal !== "object") {
                throw new Error(
                    `Expected response body[${currentPath}] to be an object but got ${actualVal}`
                );
            }
            validateResponse(expectedVal, actualVal, currentPath);
        } else {
            // 원시 값 비교
            if (actualVal !== expectedVal) {
                throw new Error(
                    `Expected response body[${currentPath}] to be ${expectedVal} but got ${actualVal}`
                );
            }
        }
    }
};

/**
 * API 테스트 설정 인터페이스
 */
export interface APITestConfig {
    pathParams?: Record<string, string>;
    queryParams?: Record<string, DSLField<any>>;
    requestBody?: Record<string, DSLField<any>>;
    requestHeaders?: Record<string, DSLField<any>>;
    expectedStatus?: HttpStatus | number;
    expectedResponseBody?: Record<string, any>;
    prettyPrint?: boolean;
}

/**
 * APITestBuilder 클래스 (체인 빌더 DSL)
 */
export class APITestBuilder {
    private config: APITestConfig;
    private method: HttpMethod;
    private url: string;

    constructor(defaults: APITestConfig = {}, method: HttpMethod, url: string) {
        this.config = { ...defaults };
        this.method = method;
        this.url = url;
    }

    withPathParams(params: Record<string, string>): this {
        this.config.pathParams = params;
        return this;
    }

    withQueryParams(params: Record<string, DSLField<any>>): this {
        this.config.queryParams = params;
        return this;
    }

    withRequestBody(body: Record<string, DSLField<any>>): this {
        this.config.requestBody = body;
        return this;
    }

    withoutHeader(headerName: string): this {
        if (this.config.requestHeaders && this.config.requestHeaders[headerName]) {
            delete this.config.requestHeaders[headerName];
        } else {
            console.warn(`Header "${headerName}" not found`);
        }
        return this;
    }

    expectStatus(status: HttpStatus | number): this {
        this.config.expectedStatus = status;
        return this;
    }

    expectResponseBody(body: Record<string, any>): this {
        this.config.expectedResponseBody = body;
        return this;
    }

    // prettyPrint 기능 활성화
    withPrettyPrint(): this {
        this.config.prettyPrint = true;
        return this;
    }

    async runTest(): Promise<Response> {
        // URL에 포함된 pathParams 치환
        let finalUrl = this.url;
        if (this.config.pathParams) {
            for (const [key, value] of Object.entries(this.config.pathParams)) {
                finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(value));
            }
        }

        // Supertest 요청 생성
        const requestInstance: SuperTest<Test> = supertest(app);
        let req = requestInstance[this.method.toLowerCase()](finalUrl);

        // 요청 헤더 설정
        if (this.config.requestHeaders) {
            for (const [key, headerObj] of Object.entries(this.config.requestHeaders)) {
                req = req.set(key, headerObj.example as string);
            }
        }

        // 쿼리 파라미터 설정
        if (this.config.queryParams) {
            const queryParams: Record<string, any> = {};
            for (const [key, fieldObj] of Object.entries(this.config.queryParams)) {
                queryParams[key] = fieldObj.example;
            }
            req = req.query(queryParams);
        }

        // 요청 본문 설정
        if (this.config.requestBody) {
            const body: Record<string, any> = {};
            for (const [key, fieldObj] of Object.entries(this.config.requestBody)) {
                body[key] = fieldObj.example;
            }
            req = req.send(body);
        }

        // 응답 상태 코드 검증
        if (this.config.expectedStatus) {
            req = req.expect(this.config.expectedStatus);
        }

        // 응답 본문 검증 (재귀적으로 검증)
        if (this.config.expectedResponseBody) {
            req = req.expect((res: Response) => {
                validateResponse(
                    this.config.expectedResponseBody as Record<string, any>,
                    res.body
                );
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
        } catch (error: any) {
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

    // thenable 구현: await 시 자동으로 runTest() 호출
    then<TResult1 = Response, TResult2 = never>(
        resolve?: ((value: Response) => TResult1 | PromiseLike<TResult1>) | null,
        reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2> {
        return this.runTest().then(resolve, reject);
    }
}

/**
 * describeAPI 옵션 인터페이스
 */
export interface APIDocOptions {
    name?: string;
    tag?: string;
    summary?: string;
    defaults?: APITestConfig;
}

/**
 * APIDoc 클래스
 */
export class APIDoc {
    method: HttpMethod;
    url: string;
    options: APIDocOptions;

    constructor(method: HttpMethod, url: string, options: APIDocOptions) {
        this.method = method;
        this.url = url;
        this.options = options;
    }

    test(): APITestBuilder {
        return new APITestBuilder(this.options.defaults, this.method, this.url);
    }
}


```
    - 코드 정리
    - 구현되지 않은 기능 작업
        - path variable
        - supertest app 넘기는 인터페이스 수정 작업 (describeAPI에 넘기는게 맞겠지? 이부분도 잠깐 검토는 해바야대)
