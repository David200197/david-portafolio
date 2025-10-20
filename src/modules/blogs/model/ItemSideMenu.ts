export type SimpleItemSideMenu = {
  title: string
  url: string
}

export type SubmenuItemSideMenu = {
  title: string
  submenu: SimpleItemSideMenu[]
}

export type ItemSideMenu = SimpleItemSideMenu | SubmenuItemSideMenu
