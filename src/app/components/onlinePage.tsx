import { Select, TextInput } from "@mantine/core";
import { IconSearch, IconWorld } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
import { flagshipStores } from "../data/data";
import { Dealer } from "../lib/interfaces";
import { getHref, normalizeCountryCode } from "../lib/utils";

export default function OnlinePage() {
  const { brand, campaign, type } = useDealerContext();
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [country, setCountry] = useState<string | null>("");
  const [search, setSearch] = useState("");

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

    const filteredDealers =
      dealers &&
      dealers.filter((d) =>
        type === "flagship"
          ? flagshipStores.includes(d.kdnr)
          : d.shopUrl !== "" || d.www !== ""
      );

    const sortedDealers = filteredDealers.sort((a, b) =>
      a.name1.localeCompare(b.name1, "de", { sensitivity: "base" })
    );

    const uniqueCountries = Array.from(
      new Set(
        sortedDealers
          .map((s) => normalizeCountryCode(s.postalAddress.country))
          .filter(Boolean)
      )
    ).sort((a, b) => a!.localeCompare(b!));

    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    const countryOptions = uniqueCountries.map((code) => ({
      value: code!,
      label: displayNames.of(code!) || code!,
    }));

    setCountries(countryOptions);
    setRetailers(sortedDealers);
  };

  useEffect(() => {
    filterRetailers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, type]);

  return (
    <div className={`${campaign ? "mt-32 md:mt-24" : "mt-24 md:mt-14"}  p-4`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TextInput
          size="md"
          placeholder="Search"
          leftSection={<IconSearch size={20} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Select
          size="md"
          placeholder="Select country"
          data={countries}
          checkIconPosition="right"
          leftSection={<IconWorld size={20} />}
          value={country}
          onChange={setCountry}
        />
      </div>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        {retailers.length > 0 &&
          retailers
            .filter((r) =>
              country
                ? normalizeCountryCode(r.postalAddress.country) === country
                : true
            )
            .filter((r) => {
              const keywords = search.trim().toLowerCase().split(" ");
              return keywords.every((keyword) =>
                [
                  r.kdnr.toString() || "",
                  r.name1 || "",
                  r.name2 || "",
                  r.name3 || "",
                ].some((value) => value.toLowerCase().includes(keyword))
              );
            })
            .map((retailer, index) => (
              <a
                key={index}
                id={`letter-${retailer.name1[0].toUpperCase()}`}
                href={
                  retailer.shopUrl
                    ? getHref(retailer.shopUrl)
                    : getHref(retailer.www)
                }
                target="_blank"
                className="flex flex-col p-2 hover:text-[var(--main)] transition-all"
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
                <p className="text-xs opacity-50">
                  {retailer.www !== ""
                    ? new URL(getHref(retailer.www)).hostname
                    : retailer.www}
                </p>
              </a>
            ))}
      </main>
    </div>
  );
}
