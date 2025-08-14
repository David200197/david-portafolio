"use client"

import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { TyperOptions } from "./Typer.interface";
import { TypedWrapper } from "./TyperWrapper";
import { cn } from "@/modules/core/lib/utils";

const Typer = ({
  className,
  fontSizeCursor = "5px",
  color,
  ...typedOptions
}: TyperOptions) => {
  const el = useRef(null);

  useEffect(() => {
    if (!el.current) return;
    const typed = new Typed(el.current as Element, typedOptions);

    return () => {
      typed.destroy();
    };
  }, [typedOptions]);

  return (
    <TypedWrapper fontSizeCursor={fontSizeCursor}>
      <p ref={el} className={cn(className, "font-sans")} color={color} />
    </TypedWrapper>
  );
};
export default Typer;
