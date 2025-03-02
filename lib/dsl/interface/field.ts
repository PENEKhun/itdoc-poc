/**
 * DSL Field 인터페이스
 * - example은 값 또는 값 검증 함수일 수 있습니다.
 */
export interface DSLField<T = any> {
  description: string;
  example: T | ((value: any) => void);
}

/**
 * DSL Helper Functions
 */
export const field = <T>(
  description: string,
  example: T | ((value: any) => void),
): DSLField<T> => ({ description, example });
