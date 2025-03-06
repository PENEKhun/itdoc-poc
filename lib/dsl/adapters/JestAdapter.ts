import { TestFramework } from "./TestFramework";
import { UserTestInterface } from "./UserTestInterface";

export class JestAdapter implements UserTestInterface {
    public name = TestFramework.Jest;

    public describe(name: string, fn: () => void): void {
        global.describe(name, fn);
    }

    public it(name: string, fn: () => void): void {
        global.it(name, fn);
    }

    public before(fn: () => void): void {
        (global as any).beforeAll(fn);
    }

    public after(fn: () => void): void {
        (global as any).afterAll(fn);
    }

    public beforeEach(fn: () => void): void {
        global.beforeEach(fn);
    }

    public afterEach(fn: () => void): void {
        global.afterEach(fn);
    }
}
