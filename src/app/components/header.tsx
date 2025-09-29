"use client";
import { IconChevronRight } from "@tabler/icons-react";
import BrandSelect from "./brandSelect";
import Logo from "./logo";
import TypeSelect from "./typeSelect";

export default function Header() {
  return (
    <header className="fixed top-0 z-20 w-full flex flex-col md:flex-row justify-between md:items-center gap-2 px-4 py-2 bg-[var(--background)]">
      <div className="md:place-self-start">
        <Logo />
      </div>
      <div className="flex items-center gap-1 bg-[var(--background-subtle)]">
        <TypeSelect />
        <IconChevronRight size={16} />
        <BrandSelect />
      </div>
    </header>
  );
}
