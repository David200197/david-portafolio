import { SubmenuItemMenuDTO } from "../models/GetItemMenuDTO";

export class SubmenuItemMenu {
  readonly title: string;
  readonly submenu: {
    title: string;
    href: string;
    description?: string;
  }[];

  constructor(value: SubmenuItemMenuDTO) {
    this.title = value.title;
    this.submenu = [...value.submenu];
  }
}
