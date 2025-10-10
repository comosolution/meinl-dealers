import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import { Dealer } from "../lib/interfaces";
import { getHref } from "../lib/utils";

export default function Online({ retailer }: { retailer: Dealer }) {
  return (
    <a
      href={
        retailer.shopUrl ? getHref(retailer.shopUrl) : getHref(retailer.www)
      }
      target="_blank"
      className="group flex flex-col justify-end gap-4 p-4 border border-transparent hover:border-[var(--main)] bg-[var(--background)] hover:text-[var(--main)] transition-all"
    >
      {retailer.logo && retailer.logo !== "" && (
        <div
          className="relative overflow-hidden"
          style={{ width: "100%", height: "120px" }}
        >
          <Image
            src={retailer.logo}
            fill
            style={{ objectFit: "contain" }}
            alt={`Logo ${retailer.name1}`}
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2>{retailer.name1}</h2>
          <p className="text-xs opacity-50">
            {retailer.www !== ""
              ? new URL(getHref(retailer.www)).hostname
              : retailer.www}
          </p>
        </div>
        <IconChevronRight
          size={32}
          className="opacity-0 group-hover:opacity-100 -rotate-90 group-hover:rotate-0 transition-all duration-300"
        />
      </div>
    </a>
  );
}
