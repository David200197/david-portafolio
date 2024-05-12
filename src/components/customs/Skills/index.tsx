import Skill from '@/components/customs/Skills/Skill'
import {
  ApolloSvg,
  CssSvg,
  ExpressSvg,
  GraphqlSvg,
  HtmlSvg,
  JavascriptSvg,
  MaterialUISvg,
  NestSvg,
  NextSvg,
  NodeSvg,
  ReactSvg,
  SassSvg,
  TailwindSvg,
  TypescriptSvg
} from '@/components/svg'

type Props = { showMobileText?: boolean }

export const JavascriptSkill = (props: Props) => (
  <Skill {...props} icon={JavascriptSvg} title='Javascript' to='https://www.w3.org/standards/webdesign/script' />
)
export const HtmlSkill = (props: Props) => (
  <Skill {...props} icon={HtmlSvg} title='Html' to='https://www.w3.org/html/' />
)
export const CssSkill = (props: Props) => (
  <Skill {...props} icon={CssSvg} title='Css' to='https://www.w3.org/Style/CSS/Overview.en.html' />
)
export const TypescriptSkill = (props: Props) => (
  <Skill {...props} icon={TypescriptSvg} title='Typescript' to='https://www.typescriptlang.org/' />
)
export const NodeSkill = (props: Props) => <Skill {...props} icon={NodeSvg} title='Node' to='https://nodejs.org/en/' />
export const ReactSkill = (props: Props) => <Skill {...props} icon={ReactSvg} title='React' to='https://reactjs.org/' />
export const NextSkill = (props: Props) => <Skill {...props} icon={NextSvg} title='Next' to='https://nextjs.org/' />
export const MuiSkill = (props: Props) => (
  <Skill {...props} icon={MaterialUISvg} title='Material-ui' to='https://mui.com/' />
)
export const ExpressSkill = (props: Props) => (
  <Skill {...props} icon={ExpressSvg} title='Express' to='https://expressjs.com/' />
)
export const TailwindSkill = (props: Props) => (
  <Skill {...props} icon={TailwindSvg} title='Tailwind' to='https://tailwindcss.com/' />
)
export const NestSkill = (props: Props) => <Skill {...props} icon={NestSvg} title='Nest' to='https://nestjs.com/' />
export const ApolloSkill = (props: Props) => (
  <Skill {...props} icon={ApolloSvg} title='Apollo' to='https://www.apollographql.com/' />
)
export const GraphqlSkill = (props: Props) => (
  <Skill {...props} icon={GraphqlSvg} title='Graphql' to='https://graphql.org/' />
)
export const SassSkill = (props: Props) => <Skill {...props} icon={SassSvg} title='Sass' to='https://sass-lang.com/' />
