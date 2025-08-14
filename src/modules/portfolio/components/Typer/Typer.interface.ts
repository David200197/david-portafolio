import { TypedOptions } from "typed.js";

export type TypedWrapperOptions = { fontSizeCursor?: string };

export type TyperOptions = TypedOptions & {
  color: string;
  className?: string;
} & TypedWrapperOptions;
