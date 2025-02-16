import UserAccount from "../models/user-account.js";

/**
 * 사용자 정보를 조회하는 레포지토리
 */
class UserRepository {
  /**
   *
   * @param username {string} 사용자 아이디 (eg. penekhun)
   * @returns {Promise<UserAccount>} 사용자 객체
   */
  async findUserByUsername(username) {
    return UserAccount.query()
      .where(UserAccount.FIELD_NAMES.USERNAME, username)
      .first();
  }
}

export const userRepository = new UserRepository();
