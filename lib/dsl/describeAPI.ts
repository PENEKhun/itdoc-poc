import { HttpMethod } from './enums/HttpMethod.js';
import { APIDoc, APIDocOptions } from './apiTestHelper.js';
import { describeCommon } from './adapters/index.js';

/**
 * API 명세를 위한 describe 함수
 * @param method HTTP 메서드
 * @param url API URL
 * @param options API 문서 옵션
 * @param callback API 테스트 함수
 */
export const describeAPI = (
  method: HttpMethod,
  url: string,
  options: APIDocOptions,
  callback: (apiDoc: APIDoc) => void,
): void => {
  if (!options.name) {
    throw new Error('API 이름이 필요합니다.');
  }

  if (!url.startsWith('/')) {
    throw new Error('API URL은 /로 시작해야 합니다.');
  }

  if (!callback) {
    throw new Error('API 테스트 함수가 필요합니다.');
  }

  describeCommon(`${options.name} | [${method}] ${url}`, () => {
    const apiDoc = new APIDoc(method, url, options);
    callback(apiDoc);
  });
};
