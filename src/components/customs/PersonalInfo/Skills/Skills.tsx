import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import {
  ApolloSkill,
  CssSkill,
  ExpressSkill,
  GraphqlSkill,
  HtmlSkill,
  JavascriptSkill,
  MuiSkill,
  NestSkill,
  NextSkill,
  NodeSkill,
  ReactSkill,
  SassSkill,
  TailwindSkill,
  TypescriptSkill
} from '../../Skills'

const Skills = () => (
  <Box width={250} mt={3}>
    <Grid container spacing={1}>
      <JavascriptSkill />
      <HtmlSkill />
      <CssSkill />
      <TypescriptSkill />
      <NodeSkill />
      <ReactSkill />
      <NextSkill />
      <MuiSkill />
      <ExpressSkill />
      <TailwindSkill />
      <NestSkill />
      <ApolloSkill />
      <GraphqlSkill />
      <SassSkill />
    </Grid>
  </Box>
)
export default Skills
