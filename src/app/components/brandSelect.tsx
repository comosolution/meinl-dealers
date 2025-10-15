"use client";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDealerContext } from "../context/dealerContext";
import { brands } from "../data/data";

export default function BrandSelect() {
  const { brand, setBrand } = useDealerContext();

  const searchParams = useSearchParams();
  const brandParam = searchParams.has("brand");

  useEffect(() => {
    if (brand) {
      brands.forEach((b) =>
        document.body.classList.toggle(
          b.replaceAll(" ", "-").replaceAll("&", "").toLowerCase(),
          b.replaceAll(" ", "-") === brand.replaceAll(" ", "-")
        )
      );
    }
  }, [brand]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedOption = brands.find((b) => b === brand);
  const size = 24;

  return (
    <div className={brandParam ? "hidden" : ""}>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          setBrand(val);
          combobox.closeDropdown();
        }}
        disabled={brandParam}
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
                    src={`/brands/${selectedOption
                      .replaceAll(" ", "-")
                      .toUpperCase()}.png`}
                    fill
                    alt={selectedOption}
                    style={{ objectFit: "contain" }}
                    className="inverted"
                  />
                </div>
                <p className="hidden sm:block">{selectedOption}</p>
              </div>
            ) : (
              <Input.Placeholder>Select brand</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {brands.map((b) => (
              <Combobox.Option value={b} key={b}>
                <div className="flex gap-4 items-center">
                  <div
                    className="relative overflow-hidden"
                    style={{ width: `${size}px`, height: `${size}px` }}
                  >
                    <Image
                      src={`/brands/${b
                        .replaceAll(" ", "-")
                        .toUpperCase()}.png`}
                      fill
                      alt={`${b} Logo`}
                      style={{ objectFit: "contain" }}
                      className="inverted"
                    />
                  </div>
                  <p>{b}</p>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
}
