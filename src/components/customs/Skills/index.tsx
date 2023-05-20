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
} from '@/components/svgs'

export const JavascriptSkill = () => (
  <Skill icon={JavascriptSvg} title='Javascript' to='https://www.w3.org/standards/webdesign/script' />
)
export const HtmlSkill = () => <Skill icon={HtmlSvg} title='Html' to='https://www.w3.org/html/' />
export const CssSkill = () => <Skill icon={CssSvg} title='Css' to='https://www.w3.org/Style/CSS/Overview.en.html' />
export const TypescriptSkill = () => (
  <Skill icon={TypescriptSvg} title='Typescript' to='https://www.typescriptlang.org/' />
)
export const NodeSkill = () => <Skill icon={NodeSvg} title='Node' to='https://nodejs.org/en/' />
export const ReactSkill = () => <Skill icon={ReactSvg} title='React' to='https://reactjs.org/' />
export const NextSkill = () => <Skill icon={NextSvg} title='Next' to='https://nextjs.org/' />
export const MuiSkill = () => <Skill icon={MaterialUISvg} title='Material-ui' to='https://mui.com/' />
export const ExpressSkill = () => <Skill icon={ExpressSvg} title='Express' to='https://expressjs.com/' />
export const TailwindSkill = () => <Skill icon={TailwindSvg} title='Tailwind' to='https://tailwindcss.com/' />
export const NestSkill = () => <Skill icon={NestSvg} title='Nest' to='https://nestjs.com/' />
export const ApolloSkill = () => <Skill icon={ApolloSvg} title='Apollo' to='https://www.apollographql.com/' />
export const GraphqlSkill = () => <Skill icon={GraphqlSvg} title='Graphql' to='https://graphql.org/' />
export const SassSkill = () => <Skill icon={SassSvg} title='Sass' to='https://sass-lang.com/' />
