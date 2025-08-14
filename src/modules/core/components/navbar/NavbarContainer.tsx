"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
};
export const NavbarContainer = ({ children }: Props) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between py-7 px-10 lg:px-40 fixed top-0 z-4 transition-all duration-600",
        scrolled ? "bg-white shadow-md h-18" : "h-26"
      )}
    >
      {children}
    </div>
  );
};
