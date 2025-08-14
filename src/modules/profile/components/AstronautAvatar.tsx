import { cn } from "@/modules/core/lib/utils";
import moduleCss from "./AstronautAvatar.module.css";

type Props = { className?: string };

export const AstronautAvatar = ({ className }: Props) => (
  <img
    src="astronaut_developer.svg"
    className={cn(moduleCss.astronaut_avatar, className)}
  />
);
