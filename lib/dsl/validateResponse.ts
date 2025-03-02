/**
 * DSL Field 여부를 판단합니다.
 */
const isDSLField = (obj: any): boolean =>
  obj && typeof obj === 'object' && 'example' in obj && 'description' in obj;

/**
 * DSL Field 검증을 담당합니다.
 */
const validateDSLField = (expectedDSL: any, actualVal: any, path: string): void => {
  // DSL Field의 example이 함수인 경우
  if (typeof expectedDSL.example === 'function') {
    expectedDSL.example(actualVal);
    return;
  }

  // DSL Field의 example이 객체인 경우
  if (expectedDSL.example && typeof expectedDSL.example === 'object') {
    if (isDSLField(actualVal)) {
      validateResponse(expectedDSL.example, actualVal.example, path);
    } else {
      validateResponse(expectedDSL.example, actualVal, path);
    }
    return;
  }

  // DSL Field의 example이 원시값인 경우
  if (isDSLField(actualVal)) {
    if (actualVal.example !== expectedDSL.example) {
      throw new Error(
        `Expected response body[${path}].example to be ${expectedDSL.example} but got ${actualVal.example}`
      );
    }
  } else if (actualVal !== expectedDSL.example) {
    throw new Error(
      `Expected response body[${path}] to be ${expectedDSL.example} but got ${actualVal}`
    );
  }
};

/**
 * 배열 검증을 담당합니다.
 */
const validateArray = (expectedArr: any[], actualArr: any[], path: string): void => {
  if (!Array.isArray(actualArr)) {
    throw new Error(
      `Expected response body[${path}] to be an array but got ${actualArr}`
    );
  }
  if (expectedArr.length !== actualArr.length) {
    throw new Error(
      `Expected response body[${path}] to have length ${expectedArr.length} but got ${actualArr.length}`
    );
  }
  expectedArr.forEach((elem, index) => {
    validateResponse(elem, actualArr[index], `${path}[${index}]`);
  });
};

/**
 * 재귀적으로 expected 객체와 실제 응답을 검증하는 헬퍼 함수
 */
export const validateResponse = (
  expected: any,
  actual: any,
  path: string = ''
): void => {
  // 배열인 경우
  if (Array.isArray(expected)) {
    validateArray(expected, actual, path);
    return;
  }

  // 객체인 경우
  if (expected && typeof expected === 'object') {
    for (const key in expected) {
      const currentPath = path ? `${path}.${key}` : key;
      const expectedVal = expected[key];
      const actualVal = actual ? actual[key] : undefined;

      if (isDSLField(expectedVal)) {
        validateDSLField(expectedVal, actualVal, currentPath);
      } else if (Array.isArray(expectedVal)) {
        validateArray(expectedVal, actualVal, currentPath);
      } else if (expectedVal && typeof expectedVal === 'object') {
        if (!actualVal || typeof actualVal !== 'object') {
          throw new Error(
            `Expected response body[${currentPath}] to be an object but got ${actualVal}`
          );
        }
        validateResponse(expectedVal, actualVal, currentPath);
      } else if (actualVal !== expectedVal) {
        throw new Error(
          `Expected response body[${currentPath}] to be ${expectedVal} but got ${actualVal}`
        );
      }
    }
    return;
  }

  // 원시 타입인 경우 직접 비교
  if (actual !== expected) {
    throw new Error(
      `Expected response body[${path}] to be ${expected} but got ${actual}`
    );
  }
};
