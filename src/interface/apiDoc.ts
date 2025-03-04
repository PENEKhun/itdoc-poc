import { HttpMethod } from '../enums/HttpMethod';
import { APITestBuilder, APITestConfig } from '../apiTestHelper';

/**
 * Describe API에 넘길 옵션 인터페이스
 */
export class ApiDoc {
  readonly method: HttpMethod;
  readonly url: string;
  readonly options: ApiDocOptions;
  readonly app: unknown;

  constructor(
    method: HttpMethod,
    url: string,
    options: ApiDocOptions,
    app: unknown,
  ) {
    this.method = method;
    this.url = url;
    this.options = options;
    this.app = app;
  }

  test(): APITestBuilder {
    return new APITestBuilder(
      this.options.defaults,
      this.method,
      this.url,
      this.app,
    );
  }
}

/**
 * Describe API에 넘길 옵션 인터페이스
 * @param name API 이름
 * @param tag API 태그
 * @param summary API 요약
 */
export interface ApiDocOptions {
  name?: string;
  tag?: string;
  summary?: string;
  defaults?: APITestConfig;
}
