import { IconBuildingStore, IconShoppingCart } from "@tabler/icons-react";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full grid grid-cols-3 items-center gap-8 px-4 py-2 bg-[var(--background)]">
      <Logo />
      <div className="flex justify-center gap-8">
        {[
          { icon: IconBuildingStore, label: "Retail" },
          { icon: IconShoppingCart, label: "Online" },
        ].map((n, i) => (
          <div key={i} className="flex items-center gap-1">
            <n.icon size={24} stroke={2} />
            <p className="font-bold">{n.label}</p>
          </div>
        ))}
      </div>
      <div />
    </header>
  );
}
