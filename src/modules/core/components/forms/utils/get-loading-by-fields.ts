import { ZodObject } from "zod";
import { Fields } from "../types/form-type";

export const getLoadingByFields = <T extends ZodObject<any>>(
  fields?: Fields<T>
) => {
  if (!fields) return false;
  let loading = false;
  for (const key in fields) {
    if (!fields[key]) continue;
    if (fields[key].loading) {
      loading = true;
      break;
    }
  }
  return loading;
};
