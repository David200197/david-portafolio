"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/modules/core/ui/navigation-menu";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import LanguageSvg from "@/modules/core/assets/language.svg";

export const LanguageSwitcher = () => {
  const { lang } = useParams<{ lang: string }>();
  const pathname = usePathname();
  const currentPath = pathname?.replace(`/${lang}`, "/") || "/";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            <LanguageSvg width={25} height={25} />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="right-0 left-auto">
            <NavigationMenuLink asChild>
              <Link href={`/en${currentPath}`} shallow replace>
                English
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href={`/es${currentPath}`} shallow replace>
                Español
              </Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
