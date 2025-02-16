import configurePassport from "../passport/passport-config.js";
import { userRepository } from "../db/repository/user-repository.js";
import UserAccount from "../db/models/user-account.js";
import { errorDefinitions } from "../constants/error-definitions.js";
import PCloudError from "../constants/p-cloud-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import express from "express";

const authRoutes = express.Router();

configurePassport();
authRoutes.use(passport.initialize());
authRoutes.use(express.urlencoded({ extended: true }));
authRoutes.use(express.json());

// 스웨거 문서로 하면 아래와 같음.

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 아이디와 패스워드를 사용하여 로그인합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       description: 로그인에 필요한 아이디와 비밀번호
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 아이디
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: admin
 *     responses:
 *       200:
 *         description: 로그인 성공 시 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 요청에 필요한 정보(username 또는 password)가 누락된 경우
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 로그인 실패 (잘못된 사용자 이름 또는 비밀번호)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new PCloudError(errorDefinitions.AUTH.LOGIN_INVALID_BODY);
  }

  const user = await userRepository.findUserByUsername(username);

  if (!user) {
    /*
      NOTE: https://github.com/spring-projects/spring-security/issues/2280
      부채널 공격을 방지하기 위해 일정한 시간이 걸리도록 설정
     */
    bcrypt.compareSync("WRONG_PASSWORD", "CORRECT_PASSWORD");
    throw new PCloudError(errorDefinitions.AUTH.LOGIN_FAILURE);
  }

  if (!bcrypt.compareSync(password, user[UserAccount.FIELD_NAMES.PASSWORD])) {
    throw new PCloudError(errorDefinitions.AUTH.LOGIN_FAILURE);
  }

  const payload = {
    id: user[UserAccount.FIELD_NAMES.ID],
    username: user[UserAccount.FIELD_NAMES.USERNAME],
  };
  // TODO: 토큰 만료 시간 설정 변경
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.success({ token });
});

export default authRoutes;
