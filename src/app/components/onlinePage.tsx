import { Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
import { flagshipStores } from "../data/data";
import { Dealer } from "../lib/interfaces";
import { normalizeCountryCode } from "../lib/utils";
import { label } from "../styles/styles";
import Footer from "./footer";
import Loader from "./loader";
import Online from "./online";

export default function OnlinePage() {
  const { brand, campaign, type, userLocation } = useDealerContext();
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [country, setCountry] = useState<string | null>("DE");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filterRetailers = async () => {
    setLoading(true);
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
    const countryOptions = uniqueCountries.map((code) => {
      const normalized = normalizeCountryCode(code!);
      return {
        value: normalized!,
        label: displayNames.of(normalized!) || normalized!,
      };
    });

    setCountries(countryOptions);
    setRetailers(sortedDealers);
    setLoading(false);
  };

  useEffect(() => {
    setSearch("");
    setCountry(
      !userLocation || type === "flagship" ? "DE" : userLocation.country
    );
    filterRetailers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, type]);

  useEffect(() => {
    if (userLocation) {
      setCountry(userLocation.country);
    }
  }, [userLocation]);

  if (loading) return <Loader />;

  return (
    <div className={`flex flex-col justify-between min-h-screen`}>
      {type !== "flagship" && (
        <div className="px-8 py-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 bg-neutral-800">
          <div className="flex items-center gap-2">
            <p className={label}>Country:</p>
            <Select
              size="md"
              variant="unstyled"
              placeholder="Select country"
              data={countries}
              checkIconPosition="right"
              value={country}
              onChange={setCountry}
              searchable
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <p className={label}>Search:</p>
            <TextInput
              size="md"
              variant="unstyled"
              placeholder="Enter store name"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="w-full"
            />
          </div>
        </div>
      )}
      <div className="flex-1">
        <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
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
                    r.postalAddress.city || "",
                    r.postalAddress.street || "",
                  ].some((value) => value.toLowerCase().includes(keyword))
                );
              })
              .map((retailer) => (
                <Online key={retailer.kdnr} retailer={retailer} />
              ))}
        </main>
      </div>
      <Footer />
    </div>
  );
}
