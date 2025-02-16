/**
 * 객체를 재귀적으로 동결시켜 변경할 수 없게 만듭니다.
 *
 * @param {Object} target - 동결할 대상 객체
 * @returns {Object} 동결된 객체
 */
function deepFreeze(target) {
  if (target === null || typeof target !== "object") {
    return;
  }

  Object.keys(target).forEach((key) => {
    deepFreeze(target[key]);
  });

  Object.freeze(target);
  return target;
}

export { deepFreeze };
