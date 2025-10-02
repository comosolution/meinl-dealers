import { useEffect, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
import { flagshipStores } from "../data/data";
import { Dealer } from "../lib/interfaces";

export default function OnlinePage() {
  const { brand, campaign } = useDealerContext();
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [letters, setLetters] = useState<string[]>([]);

  const filterRetailers = async () => {
    const res = await fetch("/api/dealer", {
      method: "POST",
      body: JSON.stringify({
        brands: brand,
        campagne: campaign?.id,
        latitude: null,
        longitude: null,
        distance: null,
        type: 2,
      }),
    });

    const dealers: Dealer[] = await res.json();
    const sortedDealers = dealers.sort((a, b) =>
      a.name1.localeCompare(b.name1, "de", { sensitivity: "base" })
    );

    setLetters(
      Array.from(new Set(sortedDealers.map((s) => s.name1[0].toUpperCase())))
    );
    setRetailers(sortedDealers);
  };

  useEffect(() => {
    filterRetailers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand]);

  return (
    <div className="mt-28 md:mt-24 p-4">
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-sm">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => {
              const el = document.getElementById(`letter-${letter}`);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="text-gray-400 hover:text-black cursor-pointer"
          >
            {letter}
          </button>
        ))}
      </div>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-16">
        {retailers.length > 0 &&
          retailers.map((retailer, index) => (
            <a
              key={index}
              id={`letter-${retailer.name1[0].toUpperCase()}`}
              href={
                retailer.www.startsWith("http")
                  ? retailer.www
                  : `https://${retailer.www}`
              }
              target="_blank"
              className={`flex flex-col ${
                flagshipStores.includes(retailer.kdnr)
                  ? "border border-[var(--main)]"
                  : ""
              } px-4 py-2 hover:text-[var(--main)] transition-all`}
            >
              {/* <div
              className="relative overflow-hidden"
              style={{ width: "120px", height: "60px" }}
            >
              <Image
                src={`https://meinlcymbals.com${shop.logo}`}
                fill
                style={{ objectFit: "contain" }}
                alt={`Logo ${shop.name1}`}
                className="grayscale-100 group-hover:grayscale-0 transition-all"
              />
            </div> */}
              <h2>{retailer.name1}</h2>
              <p className="text-xs opacity-50">{retailer.www}</p>
            </a>
          ))}
      </main>
    </div>
  );
}
