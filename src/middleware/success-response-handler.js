/**
 * 라우터에서 res.success가 호출되면,
 * 공통된 응답 형태에 맞춰 응답을 보내는 미들웨어 (200 OK)
 */
const successResponseHandler = (req, res, next) => {
  res.success = (data, message = "요청이 성공적으로 처리되었습니다.") => {
    res.json(new CommonResponse(true, message, data));
  };

  next();
};

export default successResponseHandler;

/**
 * 공통된 응답 형태 클래스
 */
export class CommonResponse {
  /**
   *
   * @param isSuccess : boolean 성공적으로 처리했는지 여부
   * @param message : string 메시지
   * @param detail : object 성공했을때 보여줄 데이터 객체
   */
  constructor(isSuccess, message, detail = {}) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.detail = detail;
    this.timestamp = new Date().toISOString();
  }
}
