export interface LinkItemMenuDTO {
  title: string;
  href: string;
}

export interface SubmenuItemMenuDTO {
  title: string;
  submenu: {
    title: string;
    href: string;
    description?: string;
  }[];
}

export type GetItemMenuDTO = LinkItemMenuDTO | SubmenuItemMenuDTO;
