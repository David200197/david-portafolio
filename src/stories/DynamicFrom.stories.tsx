import React, { useEffect, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { z } from "zod";
import {
  DynamicForm,
  DynamicFormProps,
} from "@/modules/core/components/forms/DynamicForm";
import { sleep } from "@/modules/core/utils/sleep";
import { UpdatedValues } from "@/modules/core/components/forms/types/form-type";

// 📌 Esquema de validación con Zod
const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido"),
  age: z.number().min(18, "Debes tener al menos 18 años"),
  async: z.string(),
  date: z.date(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  selector: z.string(),
  password: z.string(),
  file: z.string().url(),
  multiSelector: z.array(z.any()).min(1),
  checkbox: z.boolean(),
  textarea: z.string().nullish(),
});

type FormValues = z.infer<typeof schema>;

// 📌 Configuración de Storybook
export default {
  title: "Components/DynamicForm",
  component: DynamicForm,
  argTypes: {
    onSubmit: { action: "submitted" },
  },
} as Meta<typeof DynamicForm>;

// 📌 Template para Storybook
const Template: StoryFn<DynamicFormProps<typeof schema>> = (args) => {
  const [updatedValues, setUpdatedValues] = useState({
    async: { loading: true, value: "" },
  } as UpdatedValues<typeof schema>);

  useEffect(() => {
    setTimeout(() => {
      setUpdatedValues({ async: { loading: false, value: "this is async" } });
    }, 3000);
  }, []);

  return <DynamicForm {...args} updatedValues={updatedValues} />;
};

// 📌 Historia principal
export const Default = Template.bind({});
Default.args = {
  schema,
  onSubmit: async (data: FormValues) => {
    await sleep(3);
    console.log("Formulario enviado:", data);
  },
  fields: {
    name: {
      type: "input",
      description: "*This is a example",
      placeholder: "insert your name...",
      defaultValue: "Juan",
    },
    email: {
      type: "input",
      placeholder: "Insert your email...",
    },
    age: {
      type: "inputNumber",
      min: 0,
      max: 20,
      defaultValue: 0,
    },
    async: {
      type: "input",
      defaultValue: "async value",
      disabled: true,
    },
    date: {
      type: "inputDate",
      defaultValue: new Date(),
      format: "yyyy-MM-dd HH:mm:ss",
    },
    dateRange: {
      type: "inputRangeDate",
      defaultValue: { from: new Date(), to: new Date() },
      format: "yyyy-MM-dd",
      label: "date range",
    },
    selector: {
      type: "inputSelect",
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
      defaultValue: "option2",
    },
    password: {
      type: "inputPassword",
    },
    textarea: {
      type: "textarea",
      placeholder: "Insert your text...",
    },
    file: {
      type: "inputFile",
      accept: "image/png, image/jpeg",
    },
    multiSelector: {
      type: "inputMultiSelect",
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ],
      defaultValue: ["option1", "option2"],
    },
    checkbox: {
      type: "checkbox",
      placeholder: "Check me",
    },
  },
};
