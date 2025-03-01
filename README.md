# chilldoc poc

- [유스케이스](https://github.com/PENEKhun/itdoc-poc/blob/main/e2e)
- [poc](https://github.com/PENEKhun/itdoc-poc/tree/main/lib)
## test?

```bash
# install
npm install

# build
npm run build

# run usecase (with mocha environment)
npm --prefix ./e2e/mocha-express run test

# run usecase (with jest environment)
npm --prefix ./e2e/jest-express run test
```


# TODO

- 빌드 테스트

- 테스트 프레임워크 호환성
    - [x] 사용자가 mocha 환경일 때
        - ` npm --prefix ./e2e/mocha-express run test`
        - <img width="1018" alt="image" src="https://github.com/user-attachments/assets/8fb1eaf8-2093-46bc-b470-2c4cd393dc8b" />

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