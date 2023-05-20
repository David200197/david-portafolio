import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { FunctionComponent } from 'react'
type Icon = FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined
  }
>
type Props = { title: string; to: string; icon: Icon }
const Skill = ({ title, to, icon: IconProp }: Props) => (
  <Grid item xs={3} display='flex' justifyContent='center' alignItems='center'>
    <Tooltip arrow title={title}>
      <a href={to} style={{ margin: '0 10px' }} target='_blank' rel='noreferrer'>
        <IconProp fill='white' width={30} />
      </a>
    </Tooltip>
  </Grid>
)
export default Skill
