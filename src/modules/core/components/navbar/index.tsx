import { ItemMenues } from '@/modules/portfolio/entities/ItemMenues'
import { NavbarContainer } from './NavbarContainer'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../../ui/navigation-menu'
import { cn } from '../../lib/utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../ui/drawer'
import { LanguageSwitcher } from './LanguageSwitcher'
import Menu from '../../svg/Menu'
import { getImagePath } from '../../utils/get-img-path'

type Icon = {
  src: string
  title?: string
}

type Props = {
  icon?: Icon
  items: ItemMenues
  languages?: ItemMenues
}

export function Navbar({ icon, items }: Props) {
  return (
    <NavbarContainer>
      {icon && (
        <div className="flex items-center">
          <img
            src={getImagePath(icon.src)}
            alt="navbar-icon"
            className="w-9 h-9"
          />
          {icon.title && <p className="text-2xl ml-2">{icon.title}</p>}
        </div>
      )}
      <div className="flex items-center">
        <div className="lg:hidden flex">
          <Drawer direction="right">
            <DrawerTrigger>
              <Menu fill="#000" width="24px" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="flex items-center">
                  <Menu fill="#000" width="24px" />
                  <p className="ml-1">Menu</p>
                </DrawerTitle>
              </DrawerHeader>
              <div className="w-full mt-6 flex justify-center">
                <NavigationMenu viewport={false}>
                  <NavigationMenuList className="flex flex-col">
                    {items.toLinkItem().map((item, index) => (
                      <NavigationMenuItem key={`menu_item_${index}`}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            scroll={item.isHashLink()}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              'text-md bg-transparent'
                            )}
                          >
                            <DrawerClose>
                              {item.title.toUpperCase()}
                            </DrawerClose>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList>
            {items.getLinkItems().map((item, index) => (
              <NavigationMenuItem key={`menu_item_${index}`}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    scroll={item.isHashLink()}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-md bg-transparent'
                    )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {items.getSubmenuItem().map((item, index) => (
              <NavigationMenuItem key={`menu_item_${index}`}>
                <NavigationMenuTrigger
                  className="bg-transparent"
                  aria-label={item.title}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="right-0 left-auto">
                  <ul className="grid w-[300px] gap-4">
                    {item.submenu.map((submenuItem, subIndex) => (
                      <li key={`submenu_item_${subIndex}`}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={submenuItem.href}
                            aria-label={submenuItem.title}
                          >
                            <div className="font-medium">
                              {submenuItem.title}
                            </div>
                            {submenuItem.description && (
                              <div className="text-sm text-muted-foreground">
                                {submenuItem.description}
                              </div>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <LanguageSwitcher />
      </div>
    </NavbarContainer>
  )
}
