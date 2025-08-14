import { ZodObject } from "zod";
import { Fields } from "../types/form-type";
import { DefaultValues } from "react-hook-form";

export const getDefaultValuesByFields = <T extends ZodObject<any>>(
  fields?: Fields<T>
) => {
  if (!fields) return {};
  const defaultValue: Record<string, any> = {};
  for (const key in fields) {
    if (!fields[key]) continue;
    defaultValue[key] = fields[key].defaultValue;
  }
  return defaultValue as DefaultValues<T>;
};
