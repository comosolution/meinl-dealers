"use client";
import Logo from "./logo";
import TypeSelect from "./typeSelect";

export default function Header() {
  return (
    <header className="fixed top-0 z-30 w-full grid grid-cols-3 items-center gap-2 px-4 py-2 bg-[var(--background)] shadow-2xl">
      <div className="place-self-start">
        <Logo />
      </div>
      <TypeSelect />
      <div />
    </header>
  );
}
