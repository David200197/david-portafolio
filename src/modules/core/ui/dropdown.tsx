import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ItemSelectors } from "../components/forms/types/form-type";

type Props = {
  onChange: (...event: any[]) => void;
  options: ItemSelectors;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  value?: any;
};

export const Dropdown = ({
  name,
  onChange,
  placeholder,
  value,
  disabled,
  options,
}: Props) => {
  const key = React.useRef("dropdown__" + new Date().getTime() + "__").current;

  return (
    <Select
      name={name}
      onValueChange={onChange}
      defaultValue={value}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option, index) => (
            <SelectItem key={key + index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
