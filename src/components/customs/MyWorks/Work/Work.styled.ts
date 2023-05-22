import { Avatar, styled } from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

export const ContainerSvg = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  padding: 5,
  width: '150px',
  '& svg': {
    width: '20px',
    height: 'auto',
    '& path': {
      fill: theme.palette.primary.main
    }
  }
}))

export const AvatarWork = styled(Avatar)(({ theme }) => ({
  background: theme.palette.primary.main
}))

export const JobCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  border: 'none',
  transition: 'all ease 1s',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  [theme.breakpoints.down('md')]: {
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
  },
  '&:hover': {
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}))
