"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";
import { RefCallBack } from "react-hook-form";

type Props = {
  onChange?: (...event: any[]) => void;
  value?: any;
  disabled?: boolean;
  name?: string;
  ref?: RefCallBack;
  format?: string;
};

export const DatePicker = ({
  ref,
  onChange,
  value,
  name,
  disabled,
  format: formatString,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          name={name}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, formatString ?? "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        avoidCollisions={false}
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
