import { SVGProps, useMemo } from "react";
import { ReactNode } from "react";

import { PersonalDetail } from "../models/PersonalDetail";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/core/ui/tooltip";
import ApolloSvg from "../svg/skills/Apollo";
import TypescriptSvg from "../svg/skills/Typescript";
import AdonisSvg from "../svg/skills/Adonis";
import SassSvg from "../svg/skills/Sass";
import CssSvg from "../svg/skills/Css";
import PlasmoSvg from "../svg/skills/Plasmo";
import CapacitorjsSvg from "../svg/skills/Capacitorjs";
import CvSvg from "../svg/links/Cv";
import ExpressSvg from "../svg/skills/Express";
import ReactSvg from "../svg/skills/React";
import GraphqlSvg from "../svg/skills/Graphql";
import HtmlSvg from "../svg/skills/Html";
import JavascriptSvg from "../svg/skills/Javascript";
import NodeSvg from "../svg/skills/Node";
import MaterialUISvg from "../svg/skills/MaterialUI";
import NestSvg from "../svg/skills/Nest";
import NextSvg from "../svg/skills/Next";
import TailwindSvg from "../svg/skills/Tailwind";
import GithubSvg from "../svg/links/Github";
import LinkedinSvg from "../svg/links/Linkedin";
import TelegramSvg from "../svg/links/Telegram";
import WhatsappSvg from "../svg/links/Whatsapp";

const icons: Record<string, (props: SVGProps<SVGSVGElement>) => ReactNode> = {
  apollo: ApolloSvg,
  typescript: TypescriptSvg,
  adonis: AdonisSvg,
  sass: SassSvg,
  css: CssSvg,
  plasmo: PlasmoSvg,
  capacitorjs: CapacitorjsSvg,
  cv: CvSvg,
  express: ExpressSvg,
  react: ReactSvg,
  graphql: GraphqlSvg,
  html: HtmlSvg,
  javascript: JavascriptSvg,
  node: NodeSvg,
  materialui: MaterialUISvg,
  nest: NestSvg,
  next: NextSvg,
  tailwind: TailwindSvg,
  github: GithubSvg,
  linkedin: LinkedinSvg,
  telegram: TelegramSvg,
  whatsapp: WhatsappSvg,
};

interface Props extends SVGProps<SVGSVGElement> {
  personalDetail: PersonalDetail;
}

export const PersonalDetailIcon = ({ personalDetail, ...props }: Props) => {
  const Icon = useMemo(() => icons[personalDetail.icon], [personalDetail.icon]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <a href={personalDetail.ref} target="_blank">
          {Icon && <Icon {...props} />}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>{personalDetail.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
