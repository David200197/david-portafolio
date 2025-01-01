import { styled } from '@mui/material'
import ScrollSpy from 'react-ui-scrollspy'
import db from '@/db'

const HomePage = () => {
  return (
    <ScrollSpy offsetBottom={400}>
      {db.navigations.map(navigation => {
        const CustomSection = navigation.section
        return (
          <Section id={navigation.mark} key={navigation.mark}>
            <CustomSection navigation={navigation} />
          </Section>
        )
      })}
    </ScrollSpy>
  )
}
export default HomePage

const Section = styled('section')({})
