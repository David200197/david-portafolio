import { ZodObject } from "zod";
import { UpdatedValues } from "../types/form-type";

export const getLoadingByUpdatedValues = <T extends ZodObject<any>>(
  updatedValues?: UpdatedValues<T>
) => {
  if (!updatedValues) return false;

  let loading = false;

  for (const key in updatedValues) {
    if (!updatedValues[key]) continue;
    if (updatedValues[key].loading) {
      loading = true;
      break;
    }
  }

  return loading;
};
