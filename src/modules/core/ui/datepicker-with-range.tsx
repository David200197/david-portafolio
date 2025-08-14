"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { RefCallBack } from "react-hook-form";

type Props = {
  onChange?: (...event: any[]) => void;
  value?: DateRange;
  disabled?: boolean;
  name?: string;
  ref?: RefCallBack;
  format?: string;
};

const getDateField = (value?: DateRange, formatString = "LLL dd, y") => {
  if (!value?.from) return <span>Pick a date</span>;
  if (!value?.to) return format(value.from, formatString);
  return `${format(value.from, formatString)} - ${format(
    value.to,
    formatString
  )}`;
};

export const DatePickerWithRange = ({
  disabled,
  format: formatString,
  name,
  onChange,
  value,
  ref,
}: Props) => {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id="date"
            variant={"outline"}
            disabled={disabled}
            name={name}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {getDateField(value, formatString)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
