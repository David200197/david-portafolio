import { Typography } from '@mui/material'
import { BlogBannerContainerStyled, BlogButton, Container, InitialCurveStyled } from './BlogBanner.styled'
import { useNavigate } from 'react-router-dom'
import { BLOG_PATH } from '@/constant'
import { NavigationProps } from '@/interface/db'

const BlogBanner = ({ navigation }: NavigationProps) => {
  const navigate = useNavigate()

  return (
    <Container>
      <InitialCurveStyled />
      <BlogBannerContainerStyled>
        <Typography color='#fff' textAlign='center' variant='h5' component={'h1'}>
          Blogs
        </Typography>
        <img
          src='astronaut_blog.svg'
          alt='astronaut reading newspaper'
          width={200}
          style={{ margin: '30px 0 10px 0' }}
        />
        <Typography marginY={3} color='#fff' textAlign='center' variant='body1' component={'p'}>
          You can see some of my personal blogs in this section
        </Typography>
        <BlogButton disabled={navigation.disabled} style={{ marginBottom: '50px' }} onClick={() => navigate(BLOG_PATH)}>
          See My Blogs (COMING SOON)
        </BlogButton>
      </BlogBannerContainerStyled>
    </Container>
  )
}
export default BlogBanner
