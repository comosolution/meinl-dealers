import Image from "next/image";
import { online } from "../data/shops";

export default function OnlinePage() {
  const existingLetters = Array.from(
    new Set(online.map((s) => s.title[0].toUpperCase()))
  );

  return (
    <div className="mt-28 md:mt-24 p-4">
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-sm">
        {existingLetters.map((letter) => (
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
        {online.map((shop, index) => (
          <a
            key={index}
            id={`letter-${shop.title[0].toUpperCase()}`}
            href={shop.website}
            target="_blank"
            className="flex flex-col items-center gap-2 px-4 py-8 group hover:shadow-xl transition-all"
          >
            <div
              className="relative overflow-hidden"
              style={{ width: "120px", height: "60px" }}
            >
              <Image
                src={`https://meinlcymbals.com${shop.logo}`}
                fill
                style={{ objectFit: "contain" }}
                alt={`Logo ${shop.title}`}
                className="grayscale-100 group-hover:grayscale-0 transition-all"
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <h2>{shop.title}</h2>
              <p className="text-xs dimmed">
                {shop.address} {shop.housenumber}, {shop.zip} {shop.city}
              </p>
            </div>
          </a>
        ))}
      </main>
    </div>
  );
}
