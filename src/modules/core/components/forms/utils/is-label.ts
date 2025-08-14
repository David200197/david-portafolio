import { Field } from "../types/form-type";
import { ZodObject, infer as zInfer } from "zod";

export const isLabel = <T extends ZodObject<any>>(
  field?: Field<zInfer<T>[keyof zInfer<T>]>
) => {
    return field?.type !== "checkbox"
};
