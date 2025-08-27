"use client";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const brands = [
  { label: "MEINL Cymbals", value: "MC" },
  { label: "MEINL Percussion", value: "MP" },
  { label: "MEINL Stick & Brush", value: "SB" },
  { label: "MEINL Sonic Energy", value: "SE" },
  { label: "Nino Percussion", value: "NP" },
  { label: "Ortega Guitars", value: "OG" },
];

export default function BrandSelect({ large }: { large?: boolean }) {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(
    (brand && brands.find((b) => b.value === brand?.toUpperCase())?.value) ||
      "MC"
  );

  const selectedOption = brands.find((g) => g.value === value);
  const size = large ? 32 : 20;

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          tabIndex={0}
          w={300}
          size={large ? "xl" : "md"}
          variant="filled"
          component="button"
          type="button"
          pointer
          onClick={() => combobox.toggleDropdown()}
          className="flex-1"
        >
          {selectedOption ? (
            <div className="flex gap-2 items-center">
              <div
                className="relative overflow-hidden"
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                <Image
                  src={`/brands/${selectedOption.value}.png`}
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
            <Input.Placeholder>Select your brand</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {brands.map((g) => (
            <Combobox.Option value={g.value} key={g.value}>
              <div className="flex gap-2 items-center">
                <Image
                  src={`/brands/${g.value}.png`}
                  width={size}
                  height={size}
                  alt={g.label}
                  className="inverted"
                />
                <p className="text-xl">{g.label}</p>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
