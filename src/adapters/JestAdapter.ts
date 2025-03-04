import { TestFramework } from './TestFramework.js';
import { UserTestInterface } from './UserTestInterface.js';

export class JestAdapter implements UserTestInterface {
  name = TestFramework.Jest;

  describe(name, fn) {
    global.describe(name, fn);
  }

  it(name, fn) {
    global.it(name, fn);
  }

  before(fn) {
    global.beforeAll(fn);
  }

  after(fn) {
    global.afterAll(fn);
  }

  beforeEach(fn) {
    global.beforeEach(fn);
  }

  afterEach(fn) {
    global.afterEach(fn);
  }
}
