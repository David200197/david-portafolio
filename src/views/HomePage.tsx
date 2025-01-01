import { styled } from '@mui/material'
import ScrollSpy from 'react-ui-scrollspy'
import db from '@/db'

const HomePage = () => {
  return (
    <ScrollSpy offsetBottom={400}>
      {db.navigations.map(navigator => {
        const CustomSection = navigator.section
        return (
          <Section id={navigator.mark} key={navigator.mark}>
            <CustomSection />
          </Section>
        )
      })}
    </ScrollSpy>
  )
}
export default HomePage

const Section = styled('section')({})
