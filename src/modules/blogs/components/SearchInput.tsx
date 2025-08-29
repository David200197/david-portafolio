import { cn } from '@/modules/core/lib/utils'
import { Input } from '@/modules/core/ui/input'
import { SearchIcon } from 'lucide-react'

type Props = { search: (query: string) => void; className?: string }

export const SearchInput = ({ search, className }: Props) => (
  <div className={cn('w-full h-fit max-w-[800px] relative', className)}>
    <SearchIcon className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-500 left-3" />
    <Input
      type="search"
      onChange={(e) => search(e.target.value)}
      className={
        'bg-white h-12 text-lg pl-10 pr-4 text-lg rounded-full shadow-xl/20'
      }
    />
  </div>
)
