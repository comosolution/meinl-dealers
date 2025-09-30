"use client";
import { IconChevronRight } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useDealerContext } from "../context/dealerContext";
import BrandSelect from "./brandSelect";
import Logo from "./logo";
import TypeSelect from "./typeSelect";

export default function Header() {
  const { campaign } = useDealerContext();

  return (
    <div className="fixed top-0 z-20 w-full flex flex-col bg-[var(--background)]">
      {campaign && (
        <div className="py-1 bg-[var(--main)] text-[var(--background)]">
          <Marquee autoFill>
            <div className="flex items-baseline gap-2 px-8">
              <Image
                src={`/brands/${campaign.brand
                  .replaceAll(" ", "-")
                  .toUpperCase()}.png`}
                width={24}
                height={24}
                alt={`${campaign.brand} Logo`}
                className="object-contain place-self-center"
              />
              <h2>{campaign.title}</h2>
              <p className="text-xs">{campaign.description}</p>
              <p className="text-xs opacity-60">
                Available from{" "}
                {format(campaign.start || new Date(), "dd.MM.yyyy")} to{" "}
                {format(campaign.end || new Date(), "dd.MM.yyyy")}
              </p>
            </div>
          </Marquee>
        </div>
      )}
      <header className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-2 px-4 py-2">
        <div className="flex items-center gap-1 bg-[var(--background-subtle)]">
          <TypeSelect />
          <IconChevronRight size={16} />
          <BrandSelect />
        </div>
        <Logo />
      </header>
    </div>
  );
}
