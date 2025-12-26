'use client'

import { AwilixContainer } from 'awilix'
import { ReactNode, createContext, useContext } from 'react'
import container, { Cradle } from '../di/container'

const DiContext = createContext<AwilixContainer<Cradle> | null>(null)

type Props = { children: ReactNode }

export const DiProvider = ({ children }: Props) => {
  return <DiContext.Provider value={container}>{children}</DiContext.Provider>
}

export const useDi = (): AwilixContainer<Cradle> => {
  const ctx = useContext(DiContext)
  if (!ctx) {
    throw new Error('useDi must be used within a DiProvider')
  }
  return ctx
}

export const useGetService = <K extends keyof Cradle>(
  serviceIdentifier: K
): Cradle[K] => {
  const container = useDi()
  return container.resolve(serviceIdentifier)
}
