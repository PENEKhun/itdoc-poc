import { DSLField } from './field';

/**
 * DSL Header 타입 (field에 name 속성이 추가된 형태)
 */
export interface DSLHeader<T = any> extends DSLField<T> {
  name: string;
}

export const header = <T>(
  name: string,
  description: string,
  example: T | ((value: any) => void),
): DSLHeader<T> => ({ name, description, example });
