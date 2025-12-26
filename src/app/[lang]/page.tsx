import {
  getBlogService,
  getJobsService,
  getPortfolioService,
  getProfileService,
} from '@/modules/core/utils/di-utils'
import { BlogRedirect } from '@/modules/blogs/view/BlogRedirect'
import { JobSection } from '@/modules/jobs/view/JobSection'
import { PortfolioProvider } from '@/modules/portfolio/context/PortfolioContext'
import { CoverPage } from '@/modules/portfolio/view/CoverPage'
import { PersonalInfo } from '@/modules/profile/view/PersonalInfo'

const portfolioService = getPortfolioService()
const profileService = getProfileService()
const jobsService = getJobsService()
const blogService = getBlogService()

type Props = {
  params: Promise<{ lang: string }>
}

export default async function Home({ params }: Props) {
  const { lang } = await params
  const title = await portfolioService.getHomePageTitles(lang)
  const itemMenues = await portfolioService.getItemMenus(lang)
  const profile = await profileService.getProfile(lang)
  const jobs = await jobsService.getJobs(lang)
  const blogSection = await blogService.getBlogSection(lang)

  return (
    <PortfolioProvider
      value={{ title, aboutMeHref: itemMenues.getAboutMeHref() }}
    >
      <CoverPage />
      <PersonalInfo profile={profile} />
      <JobSection jobs={jobs} />
      <BlogRedirect blogSection={blogSection} />
    </PortfolioProvider>
  )
}
