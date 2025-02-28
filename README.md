# chilldoc poc

- [유스케이스](https://github.com/PENEKhun/itdoc-poc/blob/main/__tests__/cdoc.test.ts)
- [poc](https://github.com/PENEKhun/itdoc-poc/tree/main/lib)
## test?

```bash
# 유스케이스만 테스트하기 위해서 expressApp.test.ts 지정
mocha --loader=ts-node/esm __tests__/expressApp.test.ts
```

<img width="659" alt="image" src="https://github.com/user-attachments/assets/06c266e4-d308-4cb4-83b1-afa93a6ef9fa" />  

# TODO

- 테스트 프레임워크 호환성
    - [x] 사용자가 mocha 환경일 때
      - ` npm --prefix ./e2e/mocha-express run test`
    - [ ] 사용자가 jest 환경일 때
        - 추가적으로 테스트 방법도 생각해봐야 함.

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