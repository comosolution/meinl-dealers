"use client";
import { Badge } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useDealerContext } from "../context/dealerContext";
import BrandSelect from "./brandSelect";
import TypeSelect from "./typeSelect";

export default function Header() {
  const { campaign, brand } = useDealerContext();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const size = isMobile ? 32 : 64;

  const DevIndicator = () => {
    return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? (
      <Badge variant="light" color="dark">
        DEV
      </Badge>
    ) : null;
  };

  return (
    <div className="relative w-full flex flex-col">
      <div className="flex justify-between items-start gap-2 p-8">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-6xl font-bold uppercase">
              Dealer Locator
            </h1>
            <DevIndicator />
          </div>
          <p className="">
            Find your nearest {brand} dealer by entering the name of your city
            or postal code.
          </p>

          {campaign && (
            <div className="flex flex-col gap-2 pt-8">
              <h2 className="text-[var(--main)] uppercase">{campaign.title}</h2>
              <p>{campaign.description}</p>
            </div>
          )}
        </div>
        <Image
          src={`/brands/${brand!.replaceAll(" ", "-").toUpperCase()}.png`}
          width={size}
          height={size}
          alt={`${brand} Logo`}
          className="object-contain inverted"
        />
      </div>
      <header className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-2 px-4 py-2 bg-[var(--background-subtle)]">
        <TypeSelect />
        <BrandSelect />
      </header>
    </div>
  );
}
