# itdoc

- [유스케이스](https://github.com/PENEKhun/itdoc-poc/blob/main/e2e)
- [poc](https://github.com/PENEKhun/itdoc-poc/tree/main/lib)

## test?

```bash
# install
pnpm install

# build
pnpm build

# run usecase (with mocha environment)
pnpm --filter example-mocha-express test

# run usecase (with jest environment)
pnpm --filter example-jest-express test
```

# TODO

- 빌드 테스트

- 테스트 프레임워크 호환성

    - [x] 사용자가 mocha 환경일 때

        - ` npm --prefix ./e2e/mocha-express run test`
        - <img width="964" alt="image" src="https://github.com/user-attachments/assets/88f5a9cd-d6fb-4b6f-9d88-39f1c672808d" />

    - [x] 사용자가 jest 환경일 때
        - `npm --prefix ./e2e/jest-express run test`
        - <img width="975" alt="image" src="https://github.com/user-attachments/assets/e37bed75-aaa3-43e4-8206-771ee400bb27" />

- [ ] 코드 깔끔하게 정리
- [ ] 구현되지 않은 기능 확인
- [ ] Factory 적용 see - https://github.com/PENEKhun/itdoc-poc/issues/3
- [ ] `./lib` 유닛 테스트
- [ ] 응답 데이터 구조 정의 추가
    - example
        ```ts
        .expectResponseBody({
            userId: field('유효한 사용자 ID', 'penek'),
            friendId: field('유효한 친구 ID', 'zagabi'),
        })
        ```
- [ ] IDE에서 제공된 힌트 정정
- [ ] e2e 경로에서 스냅샷 테스트를 사용할 수 있도록 ??
    - example :
      https://github.com/PENEKhun/itdoc-poc/blob/main/e2e/mocha-express/__tests__/__snapshots__/expressApp.usecase.snapshot
    - 흠 근데 굳이 해야되나? 고민된다!

# script

## install

1. .env 생성 :: env.example 참고
2. npm install -g redoc-cli widdershins
3. script/oas 폴더내의 openapi.yaml 생성
4. script/llm/index.js 수정(이부분에 대한 인터페이스는 추후 cdoc완성 후 cdoc 메서드 체이닝으로 부를
   수 있게 설정할 예정)

## exec

```
node script/llm/index.js
node script/makedocs/index.mjs
```
