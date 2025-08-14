import { FC, SVGProps, useMemo } from "react";

import ApolloSvg from "@/modules/core/assets/skills/apollo.svg";
import CssSvg from "@/modules/core/assets/skills/css.svg";
import ExpressSvg from "@/modules/core/assets/skills/express.svg";
import GraphqlSvg from "@/modules/core/assets/skills/graphql.svg";
import HtmlSvg from "@/modules/core/assets/skills/html.svg";
import JavascriptSvg from "@/modules/core/assets/skills/javascript.svg";
import MaterialUISvg from "@/modules/core/assets/skills/materialUI.svg";
import NestSvg from "@/modules/core/assets/skills/nest.svg";
import NextSvg from "@/modules/core/assets/skills/next.svg";
import NodeSvg from "@/modules/core/assets/skills/node.svg";
import ReactSvg from "@/modules/core/assets/skills/react.svg";
import SassSvg from "@/modules/core/assets/skills/sass.svg";
import TailwindSvg from "@/modules/core/assets/skills/tailwind.svg";
import TypescriptSvg from "@/modules/core/assets/skills/typescript.svg";
import AdonisSvg from "@/modules/core/assets/skills/adonis.svg";
import PlasmoSvg from "@/modules/core/assets/skills/plasmo.svg";
import CapacitorJsSvg from "@/modules/core/assets/skills/capacitorjs.svg";
import CvSvg from "@/modules/core/assets/links/cv.svg";
import GithubSvg from "@/modules/core/assets/links/github.svg";
import LinkedInSvg from "@/modules/core/assets/links/linkedin.svg";
import TelegramSvg from "@/modules/core/assets/links/telegram.svg";
import WhatsappSvg from "@/modules/core/assets/links/whatsapp.svg";
import { PersonalDetail } from "../models/PersonalDetail";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/core/ui/tooltip";

const icons: Record<string, FC<SVGProps<{}>>> = {
  apollo: ApolloSvg,
  typescript: TypescriptSvg,
  adonis: AdonisSvg,
  sass: SassSvg,
  css: CssSvg,
  plasmo: PlasmoSvg,
  capacitorjs: CapacitorJsSvg,
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
  linkedin: LinkedInSvg,
  telegram: TelegramSvg,
  whatsapp: WhatsappSvg,
};

interface Props extends SVGProps<{}> {
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
