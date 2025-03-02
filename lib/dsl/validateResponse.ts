/**
 * 재귀적으로 expected 객체와 실제 응답을 검증하는 헬퍼 함수
 */
export const validateResponse = (
  expectedObj: any,
  actualObj: any,
  path: string = ''
): void => {
  // 배열인 경우 엄격하게 길이와 요소 순서를 비교합니다.
  if (Array.isArray(expectedObj)) {
    if (!Array.isArray(actualObj)) {
      throw new Error(
        `Expected response body[${path}] to be an array but got ${actualObj}`
      );
    }
    if (expectedObj.length !== actualObj.length) {
      throw new Error(
        `Expected response body[${path}] to have length ${expectedObj.length} but got ${actualObj.length}`
      );
    }
    expectedObj.forEach((expectedElem, index) => {
      const currentPath = path ? `${path}[${index}]` : `[${index}]`;
      validateResponse(expectedElem, actualObj[index], currentPath);
    });
    return;
  }

  // 객체인 경우 각 필드별로 검증
  for (const key in expectedObj) {
    const currentPath = path ? `${path}.${key}` : key;
    const expectedVal = expectedObj[key];
    const actualVal = actualObj ? actualObj[key] : undefined;

    // DSL Field로 정의된 경우 (description과 example 프로퍼티가 있다면)
    if (
      expectedVal &&
      typeof expectedVal === 'object' &&
      'example' in expectedVal &&
      'description' in expectedVal
    ) {
      // DSL Field의 example이 함수인 경우
      if (typeof expectedVal.example === 'function') {
        expectedVal.example(actualVal);
      }
      // example이 객체인 경우
      else if (expectedVal.example && typeof expectedVal.example === 'object') {
        // actualVal가 DSL Field 객체라면 그 내부 example을 비교
        if (
          actualVal &&
          typeof actualVal === 'object' &&
          'example' in actualVal &&
          'description' in actualVal
        ) {
          validateResponse(expectedVal.example, actualVal.example, currentPath);
        } else {
          // DSL Field가 아닌 값과 비교하는 경우
          validateResponse(expectedVal.example, actualVal, currentPath);
        }
      }
      // example이 원시값인 경우
      else {
        // 만약 actualVal가 DSL Field 객체라면 내부 example과 비교
        if (
          actualVal &&
          typeof actualVal === 'object' &&
          'example' in actualVal &&
          'description' in actualVal
        ) {
          if (actualVal.example !== expectedVal.example) {
            throw new Error(
              `Expected response body[${currentPath}].example to be ${expectedVal.example} but got ${actualVal.example}`
            );
          }
        } else if (actualVal !== expectedVal.example) {
          throw new Error(
            `Expected response body[${currentPath}] to be ${expectedVal.example} but got ${actualVal}`
          );
        }
      }
    }
    // 배열인 경우
    else if (Array.isArray(expectedVal)) {
      if (!Array.isArray(actualVal)) {
        throw new Error(
          `Expected response body[${currentPath}] to be an array but got ${actualVal}`
        );
      }
      if (expectedVal.length !== actualVal.length) {
        throw new Error(
          `Expected response body[${currentPath}] to have length ${expectedVal.length} but got ${actualVal.length}`
        );
      }
      expectedVal.forEach((elem, index) => {
        const arrayPath = `${currentPath}[${index}]`;
        validateResponse(elem, actualVal[index], arrayPath);
      });
    }
    // 객체인 경우 (DSL Field가 아닌 일반 객체)
    else if (expectedVal && typeof expectedVal === 'object') {
      if (!actualVal || typeof actualVal !== 'object') {
        throw new Error(
          `Expected response body[${currentPath}] to be an object but got ${actualVal}`
        );
      }
      validateResponse(expectedVal, actualVal, currentPath);
    }
    // 원시 타입 비교
    else {
      if (actualVal !== expectedVal) {
        throw new Error(
          `Expected response body[${currentPath}] to be ${expectedVal} but got ${actualVal}`
        );
      }
    }
  }
};
