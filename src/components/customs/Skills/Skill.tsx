import Grid from '@mui/material/Grid'
import { DesktopMedia, MobileMedia } from '../Media'
import { styled } from '@mui/material'
import { Icon } from '@/interface/icon'
import { CustomTooltip } from './Skill.styled'

type Props = { title: string; to: string; icon: Icon; showMobileText?: boolean; leftTooltip?: string }
const Skill = ({ title, to, icon: IconProp, showMobileText = true, leftTooltip }: Props) => (
  <CustomTooltip arrow title={title} left={leftTooltip}>
    <Grid data-skill={title} item xs={3} display='flex' justifyContent='center' alignItems='center'>
      <>
        <DesktopMedia>
          <a href={to} style={{ margin: '0 10px' }} target='_blank' rel='noreferrer'>
            <IconProp fill='white' width={30} height={30} />
          </a>
        </DesktopMedia>
        <MobileMediaContainer>
          <a href={to} style={{ margin: 'auto 10px' }} target='_blank' rel='noreferrer'>
            <IconProp fill='white' width={30} height={30} />
          </a>
          {showMobileText && <span>{title}</span>}
        </MobileMediaContainer>
      </>
    </Grid>
  </CustomTooltip>
)
export default Skill

const MobileMediaContainer = styled(MobileMedia)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 70,
  span: {
    whiteSpace: 'nowrap',
    fontSize: '15px'
  }
})
