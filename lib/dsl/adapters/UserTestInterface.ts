import { TestFramework } from "./TestFramework";

/**
 * 공통 DSL 인터페이스를 정의합니다.
 * 실제 테스트 프레임워크의 함수들을 감싸서 동일한 인터페이스를 제공할 수 있도록 합니다.
 */
export interface UserTestInterface {
    name: TestFramework;
    describe: (name: string, fn: () => void) => void;
    it: (name: string, fn: () => void) => void;
    before: (fn: () => void) => void;
    after: (fn: () => void) => void;
    beforeEach: (fn: () => void) => void;
    afterEach: (fn: () => void) => void;
    // expect: (fn: () => void) => void;
}
