"use client";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import Image from "next/image";
import { useDealerContext } from "../context/dealerContext";
import { brands } from "../data/brands";

export default function BrandSelect({ large }: { large?: boolean }) {
  const { brand, setBrand } = useDealerContext();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedOption = brands.find((b) => b.value === brand);
  const size = large ? 32 : 24;

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setBrand(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          tabIndex={0}
          w={220}
          size={large ? "xl" : "md"}
          className="flex-1"
          variant="filled"
          component="button"
          type="button"
          pointer
          onClick={() => combobox.toggleDropdown()}
        >
          {selectedOption ? (
            <div className="flex gap-2 items-center">
              <div
                className="relative overflow-hidden"
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                <Image
                  src={`/brands/${selectedOption.value
                    .replaceAll(" ", "-")
                    .toUpperCase()}.png`}
                  fill
                  alt={selectedOption.label}
                  style={{ objectFit: "contain" }}
                  className="inverted"
                />
              </div>
              <div>
                <p>{selectedOption.label}</p>
              </div>
            </div>
          ) : (
            <Input.Placeholder>Select brand</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {brands.map((b) => (
            <Combobox.Option value={b.value} key={b.value}>
              <div className="flex gap-4 items-center">
                <Image
                  src={`/brands/${b.value
                    .replaceAll(" ", "-")
                    .toUpperCase()}.png`}
                  width={size}
                  height={size}
                  alt={b.label}
                  className="inverted"
                />
                <p className={large ? "text-xl" : ""}>{b.label}</p>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
