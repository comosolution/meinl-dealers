"use client";
import { SegmentedControl } from "@mantine/core";
import { IconBuildingStore, IconShoppingCart } from "@tabler/icons-react";
import { useDealerContext } from "../context/dealerContext";

export default function TypeSelect({ large }: { large?: boolean }) {
  const { type, setType } = useDealerContext();

  return (
    <SegmentedControl
      size={large ? "xl" : "md"}
      value={type}
      onChange={(val) => setType(val as "retail" | "online")}
      data={[
        { icon: IconBuildingStore, label: "Retail", value: "retail" },
        { icon: IconShoppingCart, label: "Online", value: "online" },
      ].map((i) => {
        return {
          value: i.value,
          label: (
            <div
              className={`flex justify-center items-center ${
                large ? "gap-2" : "gap-1"
              }`}
            >
              <i.icon />
              <p>{i.label}</p>
            </div>
          ),
        };
      })}
      tabIndex={0}
    />
  );
}
