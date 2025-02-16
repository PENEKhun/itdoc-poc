import PCloudError from "../constants/p-cloud-error.js";
import { CommonResponse } from "./success-response-handler.js";

/**
 * Error 객체를 받아, 공통된 응답 형태에 맞춰 응답을 보내는 미들웨어 <br/>
 * throw new PCloudError().... 같은 에러를 처리합니다.
 *
 * @param {Error} err - 발생한 에러 객체
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default (err, req, res, next) => {
  if (err instanceof PCloudError) {
    console.info("PCloudError", err);
    res.status(err.status).json(new CommonResponse(false, err.message));
  } else {
    console.error("Unknown Error", err);
    res
      .status(500)
      .json(new CommonResponse(false, "알수 없는 에러가 발생했습니다."));
  }
};
