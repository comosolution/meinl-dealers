"use client";
import Image from "next/image";
import { useDealerContext } from "../context/dealerContext";
import BrandSelect from "./brandSelect";
import TypeSelect from "./typeSelect";

export default function Header() {
  const { campaign, brand } = useDealerContext();

  return (
    <div className="relative top-0 z-30 w-full flex flex-col shadow-md">
      <div className="flex flex-col items-start gap-4 p-16 bg-[var(--background-subtle)]">
        <div className="flex items-center gap-2">
          <Image
            src={`/brands/${brand!.replaceAll(" ", "-").toUpperCase()}.png`}
            width={64}
            height={64}
            alt={`${brand} Logo`}
            className="object-contain place-self-center inverted"
          />
          <h1>Dealer Locator</h1>
        </div>
        <p className="">
          Find your nearest {brand} dealer by entering the name of your city or
          postal code.
        </p>
        {campaign && (
          <div className="flex flex-col gap-2 pt-8">
            <h2 className="text-[var(--main)] uppercase">{campaign.title}</h2>
            <p>{campaign.description}</p>
          </div>
        )}
      </div>
      <header className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-2 px-4 py-2 bg-[var(--background-subtle)]">
        <TypeSelect />
        <BrandSelect />
      </header>
    </div>
  );
}
