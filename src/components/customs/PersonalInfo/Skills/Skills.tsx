import Grid from '@mui/material/Grid'
/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as ApolloSvg } from '@/assets/skills/apollo.svg'
import { ReactComponent as CssSvg } from '@/assets/skills/css.svg'
import { ReactComponent as ExpressSvg } from '@/assets/skills/express.svg'
import { ReactComponent as GraphqlSvg } from '@/assets/skills/graphql.svg'
import { ReactComponent as HtmlSvg } from '@/assets/skills/html.svg'
import { ReactComponent as Javascript } from '@/assets/skills/javascript.svg'
import { ReactComponent as MaterialUISvg } from '@/assets/skills/materialUI.svg'
import { ReactComponent as NestSvg } from '@/assets/skills/nest.svg'
import { ReactComponent as NextSvg } from '@/assets/skills/next.svg'
import { ReactComponent as NodeSvg } from '@/assets/skills/node.svg'
import { ReactComponent as ReactSvg } from '@/assets/skills/react.svg'
import { ReactComponent as SassSvg } from '@/assets/skills/sass.svg'
import { ReactComponent as TailwindSvg } from '@/assets/skills/tailwind.svg'
import { ReactComponent as TypescriptSvg } from '@/assets/skills/typescript.svg'
import Skill from './Skill'
import Box from '@mui/material/Box'

const Skills = () => (
  <Box width={250} mt={3}>
    <Grid container spacing={1}>
      <Skill icon={Javascript} title='Javascript' to='https://www.w3.org/standards/webdesign/script' />
      <Skill icon={HtmlSvg} title='Html' to='https://www.w3.org/html/' />
      <Skill icon={CssSvg} title='Css' to='https://www.w3.org/Style/CSS/Overview.en.html' />
      <Skill icon={TypescriptSvg} title='Typescript' to='https://www.typescriptlang.org/' />
      <Skill icon={NodeSvg} title='Node' to='https://nodejs.org/en/' />
      <Skill icon={ReactSvg} title='React' to='https://reactjs.org/' />
      <Skill icon={NextSvg} title='Next' to='https://nextjs.org/' />
      <Skill icon={MaterialUISvg} title='Material-ui' to='https://mui.com/' />
      <Skill icon={ExpressSvg} title='Express' to='https://expressjs.com/' />
      <Skill icon={TailwindSvg} title='Tailwind' to='https://tailwindcss.com/' />
      <Skill icon={NestSvg} title='Nest' to='https://nestjs.com/' />
      <Skill icon={ApolloSvg} title='Apollo' to='https://www.apollographql.com/' />
      <Skill icon={GraphqlSvg} title='Graphql' to='https://graphql.org/' />
      <Skill icon={SassSvg} title='Sass' to='https://sass-lang.com/' />
    </Grid>
  </Box>
)
export default Skills
