import { HttpMethod } from './enums/HttpMethod.js';
import { HttpStatus } from './enums/HttpStatus.js';
import supertest from 'supertest';
import { DSLField } from './interface/field';
import { validateResponse } from './validateResponse';

/**
 * API 테스트 설정 인터페이스
 */
export interface APITestConfig {
  pathParams?: Record<string, DSLField>;
  queryParams?: Record<string, DSLField>;
  requestBody?: Record<string, DSLField>;
  requestHeaders?: Record<string, DSLField>;
  expectedStatus?: HttpStatus | number;
  expectedResponseBody?: Record<string, any>;
  prettyPrint?: boolean;
}

/**
 * APITestBuilder 클래스 (체인 빌더 DSL)
 */
export class APITestBuilder {
  private config: APITestConfig;
  private readonly method: HttpMethod;
  private readonly url: string;
  private readonly app: any;

  constructor(
    defaults: APITestConfig = {},
    method: HttpMethod,
    url: string,
    app: any,
  ) {
    this.config = { ...defaults };
    this.method = method;
    this.url = url;
    this.app = app;
  }

  // DSLField를 사용하는 pathParams 메서드
  withPathParams(params: Record<string, DSLField>): this {
    this.config.pathParams = params;
    return this;
  }

  withQueryParams(params: Record<string, DSLField>): this {
    this.config.queryParams = params;
    return this;
  }

  withRequestBody(body: Record<string, DSLField>): this {
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

  withPrettyPrint(): this {
    this.config.prettyPrint = true;
    return this;
  }

  async runTest(): Promise<Response> {
    if (!this.config.expectedStatus) {
      throw new Error('Expected status is required');
    }

    // pathParams에서 DSLField의 example 값을 사용하여 URL 치환
    let finalUrl = this.url;
    if (this.config.pathParams) {
      for (const [key, fieldObj] of Object.entries(this.config.pathParams)) {
        finalUrl = finalUrl.replace(
          `{${key}}`,
          encodeURIComponent(fieldObj.example),
        );
      }
    }

    const requestInstance = supertest(this.app);
    let req = requestInstance[this.method.toLowerCase()](finalUrl);

    if (this.config.requestHeaders) {
      for (const [key, headerObj] of Object.entries(
        this.config.requestHeaders,
      )) {
        req = req.set(key, headerObj.example as string);
      }
    }

    if (this.config.queryParams) {
      const queryParams: Record<string, any> = {};
      for (const [key, fieldObj] of Object.entries(this.config.queryParams)) {
        queryParams[key] = fieldObj.example;
      }
      req = req.query(queryParams);
    }

    if (this.config.requestBody) {
      const body: Record<string, any> = {};
      for (const [key, fieldObj] of Object.entries(this.config.requestBody)) {
        body[key] = fieldObj.example;
      }
      req = req.send(body);
    }

    if (this.config.expectedStatus) {
      req = req.expect(this.config.expectedStatus);
    }

    if (this.config.expectedResponseBody) {
      req = req.expect((res: Response) => {
        validateResponse(
          this.config.expectedResponseBody as Record<string, any>,
          res.body,
        );
      });
    }

    // 만약 응답 body가 존재하는데, expectedResponseBody가 없는 경우
    if (!this.config.expectedResponseBody) {
      req = req.expect((res: Response) => {
        if (Object.keys(res.body).length > 0) {
          throw new Error(
            'Expected response body is required \n    ' +
              JSON.stringify(res.body, null, 2),
          );
        }
      });
    }

    // console.log(JSON.stringify(req, null, 2));
    try {
      const res = await req;
      if (this.config.prettyPrint) {
        console.log('=== API TEST REQUEST ===');
        console.log('Method:', this.method);
        console.log('URL:', finalUrl);
        console.log(
          'Headers:',
          JSON.stringify(this.config.requestHeaders, null, 2),
        );
        console.log(
          'Query Params:',
          JSON.stringify(this.config.queryParams, null, 2),
        );
        console.log(
          'Request Body:',
          JSON.stringify(this.config.requestBody, null, 2),
        );
        console.log('=== API TEST RESPONSE ===');
        console.log('Status:', res.status);
        console.log('Response Body:', JSON.stringify(res.body, null, 2));
      }
      return res;
    } catch (error: any) {
      if (this.config.prettyPrint) {
        console.log('=== API TEST REQUEST (on Error) ===');
        console.log('Method:', this.method);
        console.log('URL:', finalUrl);
        console.log(
          'Headers:',
          JSON.stringify(this.config.requestHeaders, null, 2),
        );
        console.log(
          'Query Params:',
          JSON.stringify(this.config.queryParams, null, 2),
        );
        console.log(
          'Request Body:',
          JSON.stringify(this.config.requestBody, null, 2),
        );
        if (error.response) {
          console.log('=== API TEST RESPONSE (Error) ===');
          console.log('Status:', error.response.status);
          console.log(
            'Response Body:',
            JSON.stringify(error.response.body, null, 2),
          );
        } else {
          console.log('Error Message:', error.message);
        }
      }
      throw error;
    }
  }

  then<TResult1 = Response, TResult2 = never>(
    resolve?: ((value: Response) => TResult1 | PromiseLike<TResult1>) | null,
    reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.runTest().then(resolve, reject);
  }
}
