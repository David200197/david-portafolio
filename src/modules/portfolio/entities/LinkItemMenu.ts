import { LinkItemMenuDTO } from "../models/GetItemMenuDTO";

export class LinkItemMenu {
  readonly title: string;
  readonly href: string;

  constructor(value: LinkItemMenuDTO) {
    this.title = value.title;
    this.href = value.href;
  }

  isHashLink() {
    return this.href.split("/").at(-1)?.startsWith("#") === true;
  }
}
