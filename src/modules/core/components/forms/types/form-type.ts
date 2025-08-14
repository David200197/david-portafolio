import { ControllerRenderProps } from "react-hook-form";
import { ZodObject, infer as zInfer } from "zod";

export type ItemSelector = {
  label: string;
  value: any;
};

export type ItemSelectors = ItemSelector[];

export type FieldProperty<
  T,
  Type extends string,
  Object extends object = {}
> = {
  type: Type;
  description?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: T;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
} & Object;

export type Field<T> =
  | FieldProperty<T, "input">
  | FieldProperty<T, "textarea">
  | FieldProperty<T, "inputNumber", { min?: number; max?: number }>
  | FieldProperty<T, "inputSelect", { options: ItemSelectors }>
  | FieldProperty<T, "inputMultiSelect", { options: ItemSelectors }>
  | FieldProperty<T, "inputPassword">
  | FieldProperty<T, "inputFile", { accept?: string }>
  | FieldProperty<T, "inputCombobox", { options: ItemSelectors }>
  | FieldProperty<T, "checkbox">
  | FieldProperty<T, "inputDate", { format?: string }>
  | FieldProperty<T, "inputRangeDate", { format?: string }>;

export type AsyncValue<T> = {
  value: T;
  loading: boolean;
};

export type Fields<T extends ZodObject<any>> = Partial<
  Record<keyof zInfer<T>, Field<zInfer<T>[keyof zInfer<T>]>>
>;

export type OnSubmit<T extends ZodObject<any>> = (
  data: zInfer<T>
) => Promise<void>;

export type DefaultValues<T extends ZodObject<any>> = Partial<zInfer<T>>;

export type UpdatedValues<T extends ZodObject<any>> = Partial<
  Record<keyof zInfer<T>, AsyncValue<zInfer<T>[keyof zInfer<T>]>>
>;

export type FieldControl = ControllerRenderProps<
  {
    [x: string]: any;
  },
  string
>;
