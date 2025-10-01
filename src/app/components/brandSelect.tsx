"use client";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import Image from "next/image";
import { useEffect } from "react";
import { useDealerContext } from "../context/dealerContext";
import { brands } from "../data/brands";

export default function BrandSelect() {
  const { brand, setBrand } = useDealerContext();

  useEffect(() => {
    if (brand) {
      brands.forEach((b) =>
        document.body.classList.toggle(
          b.value.replaceAll(" ", "-").replaceAll("&", "").toLowerCase(),
          b.value.replaceAll(" ", "-") === brand.replaceAll(" ", "-")
        )
      );
    }
  }, [brand]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedOption = brands.find((b) => b.value === brand);
  const size = 24;

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
          w={210}
          size="md"
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
              <p className="hidden sm:block">{selectedOption.label}</p>
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
                <p>{b.label}</p>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
