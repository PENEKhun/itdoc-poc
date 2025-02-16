import BaseModel from "./base-model.js";

/**
 * @typedef {Object} UserAccount
 *
 * @property {number} seqno - PK
 * @property {string} username - 사용자 아이디
 * @property {string} user_passwd - 사용자 비밀번호
 * @property {roles} user_role - 사용자 역할
 */
export default class UserAccount extends BaseModel {
  static get tableName() {
    return "user_account";
  }

  static get FIELD_NAMES() {
    return {
      ID: BaseModel.idColumn,
      USERNAME: "username",
      PASSWORD: "user_passwd",
      ROLE: "user_role",
    };
  }
}
