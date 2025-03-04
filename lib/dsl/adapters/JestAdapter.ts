import { TestFramework } from "./TestFramework";
import { UserTestInterface } from "./UserTestInterface";

export class JestAdapter implements UserTestInterface {
    name = TestFramework.Jest;

    describe(name: string, fn: () => void) {
        global.describe(name, fn);
    }

    it(name: string, fn: () => void): void {
        global.it(name, fn);
    }

    before(fn: () => void): void {
        (global as any).beforeAll(fn);
    }

    after(fn: () => void): void {
        (global as any).afterAll(fn);
    }

    beforeEach(fn: () => void): void {
        global.beforeEach(fn);
    }

    afterEach(fn: () => void): void {
        global.afterEach(fn);
    }
}
