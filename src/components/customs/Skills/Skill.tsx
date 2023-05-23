import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { FunctionComponent } from 'react'
import { DesktopMedia, MobileMedia } from '../Media'
import { styled } from '@mui/material'
type Icon = FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined
  }
>
type Props = { title: string; to: string; icon: Icon; showMobileText?: boolean }
const Skill = ({ title, to, icon: IconProp, showMobileText = true }: Props) => (
  <Grid item xs={3} display='flex' justifyContent='center' alignItems='center'>
    <Tooltip arrow title={title}>
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
    </Tooltip>
  </Grid>
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
