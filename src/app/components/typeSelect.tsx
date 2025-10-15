"use client";
import { SegmentedControl } from "@mantine/core";
import {
  IconBuildingStore,
  IconShoppingCart,
  IconStar,
} from "@tabler/icons-react";
import { useDealerContext } from "../context/dealerContext";

export default function TypeSelect() {
  const { type, setType } = useDealerContext();

  return (
    <SegmentedControl
      size="md"
      value={type}
      onChange={(val) => setType(val as "retail" | "online")}
      data={[
        { icon: IconBuildingStore, label: "Retail", value: "retail" },
        { icon: IconShoppingCart, label: "Online", value: "online" },
        { icon: IconStar, label: "Flagship", value: "flagship" },
      ].map((i) => {
        return {
          value: i.value,
          label: (
            <div className="flex justify-center items-center gap-1">
              <i.icon
                color={
                  i.value === "flagship" ? "var(--main)" : "var(--foreground)"
                }
              />
              <p className="text-sm sm:text-base">{i.label} Stores</p>
            </div>
          ),
        };
      })}
      tabIndex={0}
    />
  );
}
