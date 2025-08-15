"use client";

import {
  Root,
  Trigger,
  Content,
  Portal,
  Anchor,
} from "@radix-ui/react-popover";

import { cn } from "@/modules/core/lib/utils";

export function Popover({ ...props }: React.ComponentProps<typeof Root>) {
  return <Root data-slot="popover" {...props} />;
}

export function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </Portal>
  );
}

export function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof Anchor>) {
  return <Anchor data-slot="popover-anchor" {...props} />;
}
