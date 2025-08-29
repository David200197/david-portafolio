import { Button } from '@/modules/core/ui/button'
import Link from 'next/link'
import { getImagePath } from '@/modules/core/utils/get-img-path'
import { PageContainer } from '../components/PageContainer'

export const PageNotFound = () => (
  <PageContainer>
    <div className="w-full flex">
      <div className="m-auto flex flex-col items-center">
        <img src={getImagePath('404.svg')} alt="404" width={200} height={200} />
        <p className="text-3xl">Page not Found</p>
        <Button className="text-center mt-2">
          <Link href="/en">Go to Home</Link>
        </Button>
      </div>
    </div>
  </PageContainer>
)
