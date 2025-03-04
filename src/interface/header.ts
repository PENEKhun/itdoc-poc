import { DSLField } from './field';

export type DSLHeader = DSLField<string>;

export const header = (
  description: string,
  example: string | ((value: string) => void),
): DSLHeader => ({ description, example });
