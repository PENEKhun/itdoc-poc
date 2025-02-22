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
  example: T | ((value: any) => void),
): DSLField<T> => ({ description, example });

export const header = <T>(
  name: string,
  description: string,
  example: T | ((value: any) => void),
): DSLHeader<T> => ({ name, description, example });

/**
 * 재귀적으로 expected 객체와 실제 응답을 검증하는 헬퍼 함수
 */
const validateResponse = (
  expectedObj: Record<string, any>,
  actualObj: Record<string, any> | undefined,
  path: string = '',
): void => {
  for (const key in expectedObj) {
    const currentPath = path ? `${path}.${key}` : key;
    const expectedVal = expectedObj[key];
    const actualVal = actualObj ? actualObj[key] : undefined;

    // DSL field 객체인지 ("example" 프로퍼티가 있다면) 확인
    if (
      expectedVal &&
      typeof expectedVal === 'object' &&
      'example' in expectedVal
    ) {
      const expected = expectedVal.example;
      if (typeof expected === 'function') {
        console.log(`Validating field "${currentPath}" with value:`, actualVal);
        expected(actualVal);
      } else {
        if (actualVal !== expected) {
          throw new Error(
            `Expected response body[${currentPath}] to be ${expected} but got ${actualVal}`,
          );
        }
      }
    } else if (expectedVal && typeof expectedVal === 'object') {
      // 중첩 객체인 경우 재귀 호출
      if (typeof actualVal !== 'object') {
        throw new Error(
          `Expected response body[${currentPath}] to be an object but got ${actualVal}`,
        );
      }
      validateResponse(expectedVal, actualVal, currentPath);
    } else {
      // 원시 값 비교
      if (actualVal !== expectedVal) {
        throw new Error(
          `Expected response body[${currentPath}] to be ${expectedVal} but got ${actualVal}`,
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

    console.log(method + ' ' + url);
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
