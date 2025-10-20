'use client'

import { CircleX } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/modules/core/ui/sidebar'
import { useSidebar } from '../context/sidebar-context'
import { ItemSideMenu } from '../model/ItemSideMenu'
import { isSimpleItem, isSubmenuItem } from '../utils/item-side-menu.utils'
import { Fragment } from 'react'
import Link from 'next/link'

type Props = { items: ItemSideMenu[]; titleSideMenu: string }

export function AppSidebar({ items, titleSideMenu }: Props) {
  const { toggle } = useSidebar()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{titleSideMenu}</SidebarGroupLabel>
          <SidebarGroupAction
            title="Close"
            onClick={toggle}
            className="cursor-pointer"
          >
            <CircleX /> <span className="sr-only">Close</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Fragment key={item.title}>
                  {isSimpleItem(item) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {isSubmenuItem(item) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.submenu.map((menu) => (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <Link href={menu.url}>
                                <span>{menu.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      ))}
                    </SidebarMenuItem>
                  )}
                </Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
