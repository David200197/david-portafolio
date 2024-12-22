import BigBanner from '@/components/customs/BigBanner'
import PersonalInfo from '@/components/customs/PersonalInfo'
import MyWorks from '@/components/customs/MyWorks'
import ContactUs from '@/components/customs/ContactUs'
import { BANNER_MARK, CONTACT_US_MARK, MY_WORK_MARK, PERSONAL_INFO_MARK } from '@/constant'
import { styled } from '@mui/material'
import ScrollSpy from 'react-ui-scrollspy'

const HomePage = () => {
  return (
    <ScrollSpy offsetBottom={400}>
      <Section id={BANNER_MARK}>
        <BigBanner />
      </Section>
      <Section id={PERSONAL_INFO_MARK}>
        <PersonalInfo />
      </Section>
      <Section id={MY_WORK_MARK}>
        <MyWorks />
      </Section>
      <Section id={CONTACT_US_MARK}>
        <ContactUs />
      </Section>
    </ScrollSpy>
  )
}
export default HomePage

const Section = styled('section')({})
