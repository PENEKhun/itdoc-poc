import { Model } from "objection";

/**
 * 다른 모델들이 확장해야 하는 기본 모델을 나타냅니다.
 * @class
 * @abstract
 * @extends Model
 *
 * @description
 * `BaseModel`을 상속하는 경우, 서브 클래스에서 반드시 `FIELD_NAMES`를 정의해야 합니다.
 * 이를 통해 서브 클래스에서 사용하는 필드를 명확하게 지정할 수 있습니다.
 *
 * 이 방법은 실제 데이터베이스(DB) 컬럼명이 예약어 등으로 인해 그 목적을 명확히 나타내기 어려운 경우에 특히 유용합니다.
 * 게다가, 실 컬럼명이 변경되었을 때, 해당 컬럼과 관련된 모든 코드를 일일이 수정해야 하는 번거로움을 줄여줍니다.
 *
 * @example
 * class UserModel extends BaseModel {
 *   static FIELD_NAMES = {
 *       "컬럼을 잘 나타내는 이름": "실제 DB 컬럼명",
 *   }
 * }
 */
export default class BaseModel extends Model {
  constructor() {
    super();
    if (this.constructor.FIELD_NAMES === undefined) {
      throw new Error("FIELD_NAMES is not defined");
    }

    for (const key in this.constructor.FIELD_NAMES) {
      if (key !== key.toUpperCase()) {
        throw new Error(`FIELD_NAMES key must be UPPER_CASE: ${key}`);
      }
    }

    Object.freeze(this.constructor.FIELD_NAMES);
  }

  // 공통 설정 코드들
  static get modelPaths() {
    return [__dirname];
  }

  /**
   * @description 공통 PK 컬럼 설정
   */
  static get idColumn() {
    return "seqno";
  }
}
