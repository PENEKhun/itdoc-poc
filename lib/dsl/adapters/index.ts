import { MochaAdapter } from './MochaAdapter.js';
import { TestFramework } from './TestFramework.js';
import { UserTestInterface } from './UserTestInterface.js';

const framework: TestFramework = detectTestFramework();
let adapter: UserTestInterface;

switch (framework) {
  case TestFramework.Jest:
    /*
      NOTE: JEST의 경우엔, 사용할 때 만 동적으로 Import를 해야 함. 그렇지 않으면 다음과 같은 에러가 발생함.

      ```
      Do not import `@jest/globals` outside of the Jest test environment
      ```
     */
    const { JestAdapter } = await import('./JestAdapter.js');
    adapter = new JestAdapter();
    break;
  case TestFramework.Mocha:
    adapter = new MochaAdapter();
    break;
  default:
    throw new Error('지원하지 않는 테스트 프레임워크입니다.');
}

console.log(adapter.describe);

export const describeCommon = adapter.describe.bind(adapter);
export const itCommon = adapter.it.bind(adapter);
export const beforeCommon = adapter.before.bind(adapter);
export const afterCommon = adapter.after.bind(adapter);
export const beforeEachCommon = adapter.beforeEach.bind(adapter);
export const afterEachCommon = adapter.afterEach.bind(adapter);
export const expectCommon = adapter.expect;

// TODO: 이거 제대로 찾도록 방법을 강구해야함.
function detectTestFramework(): TestFramework {
  // Jest는 전역에 `jest` 객체가 있는 경우가 많습니다.
  if (typeof (global as any).jest !== 'undefined') {
    return TestFramework.Jest;
  }

  // 또는 Jest의 expect에 특정 메서드가 있으면 Jest라고 판단할 수 있습니다.
  if (
    typeof (global as any).expect === 'function' &&
    typeof (global as any).expect(1).toBe === 'function'
  ) {
    return TestFramework.Jest;
  }

  // Mocha는 보통 process.argv에 "mocha"가 포함된 경우가 많음.
  if (process.argv.some((arg) => arg.toLowerCase().includes('mocha'))) {
    return TestFramework.Mocha;
  }

  return TestFramework.Unknown;
}
