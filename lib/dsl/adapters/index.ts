import { MochaAdapter } from './MochaAdapter.js';
import { TestFramework } from './TestFramework.js';
import { UserTestInterface } from './UserTestInterface.js';

/**
 * 테스트 프레임워크를 감지하는 동기 함수
 */
function detectTestFramework(): TestFramework {
  // Jest는 전역에 `jest` 객체나 특정 expect 메서드가 있을 경우 감지
  if (typeof (global as any).jest !== 'undefined') {
    return TestFramework.Jest;
  }
  if (
    typeof (global as any).expect === 'function' &&
    typeof (global as any).expect(1).toBe === 'function'
  ) {
    return TestFramework.Jest;
  }
  // Mocha는 process.argv에 "mocha"가 포함되면 감지
  if (process.argv.some((arg) => arg.toLowerCase().includes('mocha'))) {
    return TestFramework.Mocha;
  }
  return TestFramework.Unknown;
}

/**
 * 어댑터를 초기화하는 비동기 함수
 */
async function initializeAdapter(): Promise<UserTestInterface> {
  const framework: TestFramework = detectTestFramework();
  let adapter: UserTestInterface;

  switch (framework) {
    case TestFramework.Jest: {
      /*
        NOTE: JEST의 경우에는, 사용할 때만 동적으로 import 해야 함.
        그렇지 않으면 "Do not import `@jest/globals` outside of the Jest test environment" 에러 발생.
      */
      const { JestAdapter } = await import('./JestAdapter.js');
      adapter = new JestAdapter();
      break;
    }
    case TestFramework.Mocha:
      adapter = new MochaAdapter();
      break;
    default:
      throw new Error('지원하지 않는 테스트 프레임워크입니다.');
  }
  return adapter;
}

/**
 * 어댑터 초기화 후 필요한 메서드들을 반환하는 함수
 */
export async function getTestAdapterExports() {
  const adapter = await initializeAdapter();
  return {
    describeCommon: adapter.describe.bind(adapter),
    itCommon: adapter.it.bind(adapter),
    beforeCommon: adapter.before.bind(adapter),
    afterCommon: adapter.after.bind(adapter),
    beforeEachCommon: adapter.beforeEach.bind(adapter),
    afterEachCommon: adapter.afterEach.bind(adapter),
    expectCommon: adapter.expect,
  };
}
