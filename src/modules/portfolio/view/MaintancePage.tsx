import { Button } from '@/modules/core/ui/button'
import Link from 'next/link'
import { getImagePath } from '@/modules/core/utils/get-img-path'
import { PageContainer } from '../components/PageContainer'

export const MaintancePage = () => (
  <PageContainer>
    <div className="w-full h-[660px] flex">
      <div className="m-auto flex flex-col items-center">
        <img
          src={getImagePath('maintenance.svg')}
          alt="maintenance"
          width={200}
          height={200}
        />
        <p className="text-3xl">This Page is Under Maintenance</p>
        <Button className="text-center mt-2" aria-label="home">
          <Link href="/en" aria-label={'home'}>
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  </PageContainer>
)
