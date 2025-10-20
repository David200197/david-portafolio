'use client'

import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { SidebarProvider as SidebarCoreProvider } from '@/modules/core/ui/sidebar'

export interface SidebarContextModel {
  open: boolean
  toggle: () => void
}

export const SidebarContext = createContext<SidebarContextModel | null>(null)

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false)
  return (
    <SidebarCoreProvider open={open}>
      <SidebarContext.Provider
        value={{ open, toggle: () => setOpen((prev) => !prev) }}
      >
        {children}
      </SidebarContext.Provider>
    </SidebarCoreProvider>
  )
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('Please, Wrap with Sidebarprovider')
  return ctx
}
