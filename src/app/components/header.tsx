import { Button } from "@mantine/core";
import {
  IconBuildingStore,
  IconCirclePlus,
  IconShoppingCart,
} from "@tabler/icons-react";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full grid grid-cols-3 items-center gap-8 px-4 py-2 bg-[var(--background)] shadow-2xl">
      <Logo />
      <div className="flex justify-center gap-8">
        {[
          { icon: IconBuildingStore, label: "Retail" },
          { icon: IconShoppingCart, label: "Online" },
        ].map((n, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 ${
              i === 0 ? "active" : "dimmed"
            } cursor-pointer`}
          >
            <n.icon size={24} stroke={2} />
            <p className="font-bold">{n.label}</p>
          </div>
        ))}
      </div>
      {/* <SegmentedControl
        size="md"
        data={[
          { icon: IconBuildingStore, label: "Retail" },
          { icon: IconShoppingCart, label: "Online" },
        ].map((i) => {
          return {
            value: i.label,
            label: (
              <div className="flex justify-center items-center gap-1">
                <i.icon />
                <p className="font-bold">{i.label}</p>
              </div>
            ),
          };
        })}
      /> */}
      <Button
        className="place-self-end"
        variant="transparent"
        leftSection={<IconCirclePlus size={16} />}
      >
        Become a MEINL dealer
      </Button>
    </header>
  );
}
