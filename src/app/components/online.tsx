import { IconTagStarred } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { flagshipStores } from "../data/data";
import { Dealer } from "../lib/interfaces";
import { getHref } from "../lib/utils";

export default function Online({ retailer }: { retailer: Dealer }) {
  const [imgSrc, setImgSrc] = useState(
    retailer.logo && retailer.logo !== "" ? retailer.logo : "/logo_l.svg"
  );

  return (
    <a
      href={
        retailer.shopUrl ? getHref(retailer.shopUrl) : getHref(retailer.www)
      }
      target="_blank"
      className="group flex flex-col justify-end gap-4 p-4 border border-transparent hover:border-[var(--main)] bg-[var(--background)] hover:text-[var(--main)] transition-all shadow-xl"
    >
      <div
        className="relative overflow-hidden"
        style={{ width: "100%", height: "120px" }}
      >
        <Image
          src={imgSrc}
          fill
          style={{ objectFit: "contain" }}
          alt={`Logo ${retailer.name1}`}
          onError={() => setImgSrc("/logo_l.svg")}
          className="md:opacity-80 md:group-hover:opacity-100 transition-all"
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 flex flex-col">
          <h2>{retailer.name1}</h2>
          <p className="text-xs opacity-50">
            {retailer.www !== ""
              ? new URL(getHref(retailer.www)).hostname
              : retailer.www}
          </p>
        </div>
        {flagshipStores.includes(retailer.kdnr) && <IconTagStarred size={32} />}
      </div>
    </a>
  );
}
