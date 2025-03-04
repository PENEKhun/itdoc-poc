/**
 * ChillDocs - Test-driven API Documentation Generator
 * @description
 * API 테스트 코드를 기반으로 문서를 자동 생성하는 라이브러리입니다.
 * @example
 * ```typescript
 * import { describeAPI, itDoc, HttpMethod } from 'chilldocs';
 *
 * describeAPI('User API', () => {
 *   itDoc('should create a user')
 *     .method(HttpMethod.POST)
 *     .path('/users')
 *     .expect(201);
 * });
 * ```
 */

export { HttpMethod } from "./enums/HttpMethod";
export { HttpStatus } from "./enums/HttpStatus";
export { describeAPI } from "./interface/describeAPI";
export { itDoc } from "./interface/itDoc";
export { field } from "./interface/field";
export type { ApiDocOptions } from "./interface/apiDoc";
