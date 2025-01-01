import { Typography } from '@mui/material'
import { BlogBannerContainerStyled, BlogButton, Container, InitialCurveStyled } from './BlogBanner.styled'
import { useNavigate } from 'react-router-dom'
import { BLOG_PATH } from '@/constant'

const BlogBanner = () => {
  const navigate = useNavigate()

  return (
    <Container>
      <InitialCurveStyled />
      <BlogBannerContainerStyled>
        <Typography color='#fff' textAlign='center' variant='h5' component={'h1'}>
          Blogs
        </Typography>
        <Typography marginY={3} color='#fff' textAlign='center' variant='body1' component={'p'}>
          You can see some of my personal blogs in this section
        </Typography>
        <BlogButton onClick={() => navigate(BLOG_PATH)}>See My Blogs</BlogButton>
      </BlogBannerContainerStyled>
    </Container>
  )
}
export default BlogBanner
