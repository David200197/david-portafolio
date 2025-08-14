import { GetItemMenuDTO } from "../models/GetItemMenuDTO";
import { LinkItemMenu } from "./LinkItemMenu";
import { SubmenuItemMenu } from "./SubmenuItemMenu";

export class ItemMenues {
  private readonly linkItems: LinkItemMenu[] = [];
  private readonly submenuItems: SubmenuItemMenu[] = [];

  constructor(value: GetItemMenuDTO[]) {
    value.forEach((item) => {
      if ("href" in item) return this.linkItems.push(new LinkItemMenu(item));
      this.submenuItems.push(new SubmenuItemMenu(item));
    });
  }

  getLinkItems(): LinkItemMenu[] {
    return this.linkItems;
  }

  getSubmenuItem(): SubmenuItemMenu[] {
    return this.submenuItems;
  }

  toLinkItem() {
    const linkItemSubmenu = this.submenuItems
      .map((item) => item.submenu.map((subItem) => new LinkItemMenu(subItem)))
      .flat();
    return [...this.linkItems, ...linkItemSubmenu];
  }
}
