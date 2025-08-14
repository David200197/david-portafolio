import InitialCurve from "@/modules/core/assets/banners/initialCurve.svg";
import FinalCurve from "@/modules/core/assets/banners/finalCurve.svg";
import { ReactNode } from "react";
import className from "./ProfileContainer.module.css";

type Props = { children: ReactNode; id?: string };

export const ProfileContainer = ({ children, id }: Props) => (
  <section id={id}>
    <InitialCurve />
    <div className={className.profile_container_body}>{children}</div>
    <FinalCurve className={className.final_curve} />
  </section>
);
