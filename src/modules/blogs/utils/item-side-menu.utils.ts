import {
  ItemSideMenu,
  SimpleItemSideMenu,
  SubmenuItemSideMenu,
} from '../model/ItemSideMenu'

export const isSimpleItem = (
  item: ItemSideMenu
): item is SimpleItemSideMenu => {
  const simpleItem: SimpleItemSideMenu = item as SimpleItemSideMenu
  return Boolean(simpleItem?.url)
}

export const isSubmenuItem = (
  item: ItemSideMenu
): item is SubmenuItemSideMenu => {
  const subMenuItem: SubmenuItemSideMenu = item as SubmenuItemSideMenu
  return Boolean(subMenuItem?.submenu)
}
