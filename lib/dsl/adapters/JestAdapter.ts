import JestPackage from '@jest/globals';

const {
  describe: jestDescribe,
  it: jestIt,
  beforeAll: jestBeforeAll,
  afterAll: jestAfterAll,
  beforeEach: jestBeforeEach,
  afterEach: jestAfterEach,
  expect: jestExpect,
} = JestPackage;

import { TestFramework } from './TestFramework.js';
import { UserTestInterface } from './UserTestInterface.js';

export class JestAdapter implements UserTestInterface {
  name = TestFramework.Jest;

  describe(name: string, fn: () => void) {
    jestDescribe(name, fn);
  }

  it(name: string, fn: () => void) {
    jestIt(name, fn);
  }

  before(fn: () => void) {
    jestBeforeAll(fn);
  }

  after(fn: () => void) {
    jestAfterAll(fn);
  }

  beforeEach(fn: () => void) {
    jestBeforeEach(fn);
  }

  afterEach(fn: () => void) {
    jestAfterEach(fn);
  }

  expect = jestExpect;
}
