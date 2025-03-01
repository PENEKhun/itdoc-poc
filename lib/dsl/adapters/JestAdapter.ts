import { TestFramework } from './TestFramework.js';
import { UserTestInterface } from './UserTestInterface.js';

export class JestAdapter implements UserTestInterface {
  name = TestFramework.Jest;

  private jestModule: typeof import('@jest/globals') | null = null;

  async init() {
    if (!this.jestModule) {
      this.jestModule = await import('@jest/globals');
    }
  }

  async describe(name: string, fn: () => void) {
    await this.init();
    this.jestModule!.describe(name, fn);
  }

  async it(name: string, fn: () => void) {
    await this.init();
    this.jestModule!.it(name, fn);
  }

  async before(fn: () => void) {
    await this.init();
    this.jestModule!.beforeAll(fn);
  }

  async after(fn: () => void) {
    await this.init();
    this.jestModule!.afterAll(fn);
  }

  async beforeEach(fn: () => void) {
    await this.init();
    this.jestModule!.beforeEach(fn);
  }

  async afterEach(fn: () => void) {
    await this.init();
    this.jestModule!.afterEach(fn);
  }

  get expect() {
    return this.jestModule?.expect;
  }
}
