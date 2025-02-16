export default class PCloudError extends Error {
  /**
   * @param {{ status: number, message: string }} errorDetail - 에러 정의 객체
   * @param {string} [customMessage] - 커스텀 에러 메시지 (선택 사항)
   */
  constructor(errorDetail, customMessage) {
    if (
      !errorDetail ||
      !errorDetail.status ||
      !errorDetail.message ||
      typeof errorDetail.status != "number" ||
      typeof errorDetail.message != "string"
    ) {
      throw new Error(
        "PCloudError를 생성하기 위한 올바른 에러 정의 객체가 필요합니다."
      );
    }

    super(customMessage || errorDetail.message);
    this.status = errorDetail.status;
    this.name = "PCloudError";
    Error.captureStackTrace(this, this.constructor);
  }
}
