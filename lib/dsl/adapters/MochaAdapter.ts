import { TestFramework } from "./TestFramework";
import { UserTestInterface } from "./UserTestInterface";

export class MochaAdapter implements UserTestInterface {
    name = TestFramework.Mocha; // 초기값이 필요해서 이렇게 함
    private mochaGlobals: any;

    constructor() {
        this.mochaGlobals = {
            describe: global.describe,
            it: global.it,
            before: global.before,
            after: global.after,
            beforeEach: global.beforeEach,
            afterEach: global.afterEach,
        };

        if (!this.mochaGlobals.describe) {
            const mocha = require("mocha");
            this.mochaGlobals = {
                describe: mocha.describe,
                it: mocha.it,
                before: mocha.before,
                after: mocha.after,
                beforeEach: mocha.beforeEach,
                afterEach: mocha.afterEach,
            };
        }
    }

    describe(name: string, fn: () => void): void {
        if (!this.mochaGlobals.describe) {
            throw new Error("Mocha describe function is not available");
        }
        this.mochaGlobals.describe(name, fn);
    }

    it(name: string, fn: () => void): void {
        if (!this.mochaGlobals.it) {
            throw new Error("Mocha it function is not available");
        }
        this.mochaGlobals.it(name, fn);
    }

    before(fn: () => void): void {
        if (!this.mochaGlobals.before) {
            throw new Error("Mocha before function is not available");
        }
        this.mochaGlobals.before(fn);
    }

    after(fn: () => void): void {
        if (!this.mochaGlobals.after) {
            throw new Error("Mocha after function is not available");
        }
        this.mochaGlobals.after(fn);
    }

    beforeEach(fn: () => void): void {
        if (!this.mochaGlobals.beforeEach) {
            throw new Error("Mocha beforeEach function is not available");
        }
        this.mochaGlobals.beforeEach(fn);
    }

    afterEach(fn: () => void): void {
        if (!this.mochaGlobals.afterEach) {
            throw new Error("Mocha afterEach function is not available");
        }
        this.mochaGlobals.afterEach(fn);
    }
}
