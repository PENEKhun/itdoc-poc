import { HttpMethod } from '../enums/HttpMethod';
import { getTestAdapterExports } from '../adapters';
import { ApiDoc, ApiDocOptions } from './apiDoc';

/**
 * API 명세를 위한 describe 함수
 * @param method HTTP 메서드
 * @param url API URL
 * @param options API 문서 옵션
 * @param app Express 앱 인스턴스 (supertest 생성에 사용)
 * @param callback API 테스트 함수
 */
export const describeAPI = (
  method: HttpMethod,
  url: string,
  options: ApiDocOptions,
  app: any,
  callback: (apiDoc: ApiDoc) => void,
): void => {
  if (!options.name) {
    throw new Error('API 이름이 필요합니다.');
  }

  if (!url.startsWith('/')) {
    throw new Error('API URL은 /로 시작해야 합니다.');
  }

  if (!app) {
    throw new Error('Express 앱 인스턴스가 필요합니다.');
  }

  if (!callback) {
    throw new Error('API 테스트 함수가 필요합니다.');
  }

  const { describeCommon } = getTestAdapterExports();
  describeCommon(`${options.name} | [${method}] ${url}`, () => {
    const apiDoc = new ApiDoc(method, url, options, app);
    callback(apiDoc);
  });
};
