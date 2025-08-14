import { useForm } from "react-hook-form";
import { ZodObject, infer as zInfer } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Button } from "../../ui/button";
import { dynamicField } from "./DynamicField";
import { Fields, OnSubmit, UpdatedValues } from "./types/form-type";
import { Loader } from "lucide-react";
import { getLoadingByUpdatedValues } from "./utils/get-loading-by-updated-values";
import { getDefaultValuesByFields } from "./utils/get-default-values-by-fields";
import { getLoadingByFields } from "./utils/get-loading-by-fields";
import { cn } from "../../lib/utils";
import { isLabel } from "./utils/is-label";

export type DynamicFormProps<T extends ZodObject<any>> = {
  schema: T;
  onSubmit: OnSubmit<T>;
  updatedValues?: UpdatedValues<T>;
  fields?: Fields<T>;
  onBack?: () => void;
};

export const DynamicForm = <T extends ZodObject<any>>({
  schema,
  onSubmit,
  updatedValues,
  onBack,
  fields,
}: DynamicFormProps<T>) => {
  const updateValuesLoading = getLoadingByUpdatedValues(updatedValues);
  const fieldsLoading = getLoadingByFields(fields);
  const [formLoading, setFormLoading] = useState(false);
  const loading = updateValuesLoading || fieldsLoading || formLoading;

  const handleSubmit = async (values: zInfer<T>) => {
    setFormLoading(true);
    await onSubmit(values);
    setFormLoading(false);
  };

  const defaultValues = getDefaultValuesByFields(fields);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!updatedValues) return;
    for (const key in updatedValues) {
      if (!updatedValues[key]) continue;
      form.setValue(key, updatedValues[key].value);
    }
  }, [updatedValues, form]);

  const keys = useMemo(() => Object.keys(schema.shape), [schema])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 ">
        <div className="grid grid-cols-12 gap-4">
          {keys.map((key) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field: fieldControl }) => {
                const field = fields?.[key];
                const updateLoading = updatedValues?.[key]?.loading;

                return (
                  <FormItem
                    className={cn(
                      "mb-4",
                      field?.className ?? "col-span-12 md:col-span-4",
                      field?.type === "textarea" ? "md:col-span-12" : ""
                    )}
                  >
                    {isLabel(field) && (
                      <FormLabel>{field?.label ?? key}</FormLabel>
                    )}
                    <FormControl>
                      {dynamicField({
                        fieldControl,
                        field,
                        loading: updateLoading,
                        disabled: loading,
                        form,
                      })}
                    </FormControl>
                    <div className="relative">
                      <div className="flex flex-col absolute -top-1">
                        {field?.description && (
                          <FormDescription className="text-xs">
                            {field.description}
                          </FormDescription>
                        )}
                        <FormMessage className="text-xs" />
                      </div>
                    </div>
                  </FormItem>
                );
              }}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant={"secondary"} onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" variant={"default"} disabled={loading}>
            {loading && <Loader className="animate-spin" />}Send
          </Button>
        </div>
      </form>
    </Form>
  );
};
