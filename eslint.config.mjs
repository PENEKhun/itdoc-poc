import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import mochaPlugin from "eslint-plugin-mocha";

export default tseslint.config(
    // ESLint 기본 추천 규칙
    eslint.configs.recommended,
    // TypeScript 추천 규칙
    ...tseslint.configs.recommended,
    // JSDoc 문서화 추천 규칙
    jsdoc.configs["flat/recommended"],
    // Mocha 플러그인 설정
    {
        plugins: {
            mocha: mochaPlugin,
        },
    },
    {
        languageOptions: {
            // 사용할 JavaScript 버전 지정
            ecmaVersion: 2022,
            // ESM 모듈 시스템 사용
            sourceType: "module",
            // TypeScript 파서 사용
            parser: tseslint.parser,
            parserOptions: {
                // TypeScript 설정 파일 지정
                project: "./tsconfig.json",
            },
            // env 대신 globals 사용
            globals: {
                ...globals.node,
                ...globals.es2022,
                ...globals.mocha,
            },
        },
        rules: {
            // TypeScript 관련 규칙
            // 함수의 반환 타입 명시 필수
            "@typescript-eslint/explicit-function-return-type": "error",
            // any 타입 사용 금지
            "@typescript-eslint/no-explicit-any": "error",
            // 사용하지 않는 변수 에러 처리 (_로 시작하는 변수는 제외)
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            // 클래스 멤버의 접근 제한자 명시 필수
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                { accessibility: "explicit" },
            ],

            // JSDoc 문서화 규칙
            // 설명 필수
            "jsdoc/require-description": "error",
            // 매개변수 설명 필수
            "jsdoc/require-param-description": "error",
            // 반환값 설명 필수
            "jsdoc/require-returns-description": "error",
            // 예제 코드 필수
            "jsdoc/require-example": "error",
            // 예제 코드 유효성 검사
            "jsdoc/check-examples": "error",
            // 예외 처리 문서화 필수
            "jsdoc/require-throws": "error",

            // 코드 품질 규칙
            // 중첩 콜백 최대 3개까지 허용
            "max-nested-callbacks": ["error", 3],
            // 함수당 최대 50줄 제한 (빈 줄과 주석 제외)
            "max-lines-per-function": [
                "error",
                { max: 50, skipBlankLines: true, skipComments: true },
            ],

            // Mocha 테스트 관련 규칙
            // 건너뛴 테스트 경고
            "mocha/no-skipped-tests": "warn",
            // 단독 실행 테스트 금지
            "mocha/no-exclusive-tests": "error",
        },
        // JSDoc 설정
        settings: {
            jsdoc: {
                // TypeScript 모드 활성화
                mode: "typescript",
                // 태그 이름 설정
                tagNamePreference: {
                    returns: "returns",
                    example: "example",
                },
            },
        },
    },
    // Prettier와의 충돌 방지
    eslintConfigPrettier,
    {
        files: ["**/*.ts"],
        plugins: {
            jsdoc,
        },
        processor: "jsdoc/jsdoc",
    },
);
