import { Select, TextInput } from "@mantine/core";
import { IconSearch, IconWorld } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
import { flagshipStores } from "../data/data";
import { Dealer } from "../lib/interfaces";
import { normalizeCountryCode } from "../lib/utils";
import Footer from "./footer";
import Loader from "./loader";
import Online from "./online";

export default function OnlinePage() {
  const { brand, campaign, type, userLocation } = useDealerContext();
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [country, setCountry] = useState<string | null>("");
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
    <div
      className={`flex flex-col justify-between ${
        campaign ? "pt-36 md:pt-28" : "pt-28 md:pt-18"
      } p-4 bg-[rgba(var(--main-rgb),0.1)] min-h-screen`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          searchable
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
              <Online key={index} retailer={retailer} />
            ))}
      </main>
      <Footer />
    </div>
  );
}
