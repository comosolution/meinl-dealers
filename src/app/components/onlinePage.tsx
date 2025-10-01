import { useEffect, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
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
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mx-8">
        {retailers.length > 0 &&
          retailers.map((retailer, index) => (
            <a
              key={index}
              id={`letter-${retailer.name1[0].toUpperCase()}`}
              href={retailer.www}
              target="_blank"
              className="flex flex-col items-center gap-2 px-4 py-8 group hover:shadow-xl transition-all"
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
              <div className="flex flex-col items-center text-center">
                <h2>{retailer.name1}</h2>
                <p className="text-xs dimmed">
                  {retailer.postalAddress.street}, {retailer.postalAddress.zip}{" "}
                  {retailer.postalAddress.city}
                </p>
              </div>
            </a>
          ))}
      </main>
    </div>
  );
}
