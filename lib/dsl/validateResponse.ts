/**
 * 재귀적으로 expected 객체와 실제 응답을 검증하는 헬퍼 함수
 */
export const validateResponse = (
  expectedObj: any,
  actualObj: any,
  path: string = '',
): void => {
  // 배열인 경우 엄격하게 길이와 요소 순서를 비교합니다.
  if (Array.isArray(expectedObj)) {
    if (!Array.isArray(actualObj)) {
      throw new Error(
        `Expected response body[${path}] to be an array but got ${actualObj}`,
      );
    }
    if (expectedObj.length !== actualObj.length) {
      throw new Error(
        `Expected response body[${path}] to have length ${expectedObj.length} but got ${actualObj.length}`,
      );
    }
    expectedObj.forEach((expectedElem, index) => {
      const currentPath = path ? `${path}[${index}]` : `[${index}]`;
      if (expectedElem && typeof expectedElem === 'object') {
        validateResponse(expectedElem, actualObj[index], currentPath);
      } else {
        if (actualObj[index] !== expectedElem) {
          throw new Error(
            `Expected response body[${currentPath}] to be ${expectedElem} but got ${actualObj[index]}`,
          );
        }
      }
    });
    return;
  }

  // 배열이 아닌 객체의 경우
  for (const key in expectedObj) {
    const currentPath = path ? `${path}.${key}` : key;
    const expectedVal = expectedObj[key];
    const actualVal = actualObj ? actualObj[key] : undefined;

    // DSL Field로 정의된 경우
    if (
      expectedVal &&
      typeof expectedVal === 'object' &&
      'example' in expectedVal
    ) {
      const expected = expectedVal.example;
      if (typeof expected === 'function') {
        expected(actualVal);
      } else {
        if (actualVal !== expected) {
          throw new Error(
            `Expected response body[${currentPath}] to be ${expected} but got ${actualVal}`,
          );
        }
      }
    }
    // 만약 해당 필드가 배열이면
    else if (Array.isArray(expectedVal)) {
      if (!Array.isArray(actualVal)) {
        throw new Error(
          `Expected response body[${currentPath}] to be an array but got ${actualVal}`,
        );
      }
      if (expectedVal.length !== actualVal.length) {
        throw new Error(
          `Expected response body[${currentPath}] to have length ${expectedVal.length} but got ${actualVal.length}`,
        );
      }
      for (let i = 0; i < expectedVal.length; i++) {
        const arrayPath = `${currentPath}[${i}]`;
        if (expectedVal[i] && typeof expectedVal[i] === 'object') {
          validateResponse(expectedVal[i], actualVal[i], arrayPath);
        } else {
          if (actualVal[i] !== expectedVal[i]) {
            throw new Error(
              `Expected response body[${arrayPath}] to be ${expectedVal[i]} but got ${actualVal[i]}`,
            );
          }
        }
      }
    }
    // 객체인 경우 재귀적으로 검증합니다.
    else if (expectedVal && typeof expectedVal === 'object') {
      if (typeof actualVal !== 'object') {
        throw new Error(
          `Expected response body[${currentPath}] to be an object but got ${actualVal}`,
        );
      }
      validateResponse(expectedVal, actualVal, currentPath);
    }
    // 기본 타입 비교
    else {
      if (actualVal !== expectedVal) {
        throw new Error(
          `Expected response body[${currentPath}] to be ${expectedVal} but got ${actualVal}`,
        );
      }
    }
  }
};
