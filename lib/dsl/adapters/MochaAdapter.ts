import { TestFramework } from "./TestFramework";
import { UserTestInterface } from "./UserTestInterface";

export class MochaAdapter implements UserTestInterface {
    public name = TestFramework.Mocha;
    private mochaGlobals: any;

    public constructor() {
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

    public describe(name: string, fn: () => void): void {
        if (!this.mochaGlobals.describe) {
            throw new Error("Mocha describe function is not available");
        }
        this.mochaGlobals.describe(name, fn);
    }

    public it(name: string, fn: () => void): void {
        if (!this.mochaGlobals.it) {
            throw new Error("Mocha it function is not available");
        }
        this.mochaGlobals.it(name, fn);
    }

    public before(fn: () => void): void {
        if (!this.mochaGlobals.before) {
            throw new Error("Mocha before function is not available");
        }
        this.mochaGlobals.before(fn);
    }

    public after(fn: () => void): void {
        if (!this.mochaGlobals.after) {
            throw new Error("Mocha after function is not available");
        }
        this.mochaGlobals.after(fn);
    }

    public beforeEach(fn: () => void): void {
        if (!this.mochaGlobals.beforeEach) {
            throw new Error("Mocha beforeEach function is not available");
        }
        this.mochaGlobals.beforeEach(fn);
    }

    public afterEach(fn: () => void): void {
        if (!this.mochaGlobals.afterEach) {
            throw new Error("Mocha afterEach function is not available");
        }
        this.mochaGlobals.afterEach(fn);
    }
}
