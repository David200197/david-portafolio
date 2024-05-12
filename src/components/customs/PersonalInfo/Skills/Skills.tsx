import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Skill as SkillType } from '@/interface/db'
import Skill from '../../Skills/Skill'

type Props = { skills: SkillType[] }
const Skills = ({ skills }: Props) => (
  <Box width={250} mt={3}>
    <Grid container rowSpacing={4} columnSpacing={8}>
      {skills.map((props, index) => (
        <Skill
          key={`skill_${index}`}
          icon={props.icon}
          title={props.title}
          to={props.to}
          showMobileText={props.showMobileText}
        />
      ))}
    </Grid>
  </Box>
)
export default Skills
