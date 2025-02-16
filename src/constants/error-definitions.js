import { deepFreeze } from "../util/object-util.js";

/**
 * 에러 정의를 담고 있는 객체입니다.
 * 이 객체는 애플리케이션에서 발생할 수 있는 다양한 에러를 정의하고 있으며,
 * 각 에러는 HTTP 상태 코드와 에러 메시지를 포함합니다.
 */
export const errorDefinitions = deepFreeze({
  AUTH: {
    LOGIN_FAILURE: {
      status: 401,
      message: "없는 사용자거나 잘못된 패스워드입니다",
    },
    LOGIN_INVALID_BODY: {
      status: 400,
      message: "아이디와 패스워드는 필수로 입력되어야 합니다",
    },
    LOGIN_REQUIRED: {
      status: 401,
      message: "로그인이 필요합니다",
    },
    EXPIRED_TOKEN: {
      status: 401,
      message: "만료된 토큰입니다",
    },
  },
  GOODS: {
    NOT_FOUND: {
      status: 404,
      message: "상품을 찾을 수 없습니다",
    },
  },
  COMMON: {
    NOT_FOUND_ERROR: {
      status: 404,
      message: "찾을 수 없는 리소스입니다",
    },
    INVALID_INPUT: {
      status: 400,
      message: "잘못된 입력입니다",
    },
  },
  CLOUD_SERVER: {
    NOT_FOUND: {
      status: 404,
      message: "클라우드 서버를 찾을 수 없습니다",
    },
  },
  IDC_SERVICE: {
    NOT_FOUND: {
      status: 404,
      message: "IDC 서비스를 찾을 수 없습니다",
    },
    INVALID_STATUS_CHANGE: {
      status: 400,
      message: "유효하지 않은 상태 전환입니다",
    },
  },
  BILLING: {
    DATE_INVALID: {
      status: 400,
      message: "날짜 형식이 잘못되었거나 범위를 벗어났습니다",
    },
  },
});

export default errorDefinitions;
