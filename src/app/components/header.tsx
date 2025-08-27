"use client";
import { IconChevronRight } from "@tabler/icons-react";
import BrandSelect from "./brandSelect";
import Logo from "./logo";
import TypeSelect from "./typeSelect";

export default function Header() {
  return (
    <header className="fixed top-0 z-20 w-full flex justify-between items-center gap-2 p-4 bg-[var(--background)] shadow-2xl">
      <div className="place-self-start">
        <Logo />
      </div>
      <div className="flex items-center gap-2 bg-[var(--background-subtle)]">
        <TypeSelect />
        <IconChevronRight size={16} color="gray" />
        <BrandSelect />
      </div>
    </header>
  );
}
