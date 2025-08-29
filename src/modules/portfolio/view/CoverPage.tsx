import DownButton from '../components/DownButton'
import { PageContainer } from '../components/PageContainer'
import TitleBanner from '../components/TitleBanner'

export const CoverPage = () => {
  return (
    <PageContainer height="150%" id="home">
      <TitleBanner />
      <DownButton />
    </PageContainer>
  )
}
