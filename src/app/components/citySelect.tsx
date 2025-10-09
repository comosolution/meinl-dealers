"use client";
import { ActionIcon, Autocomplete } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMemo } from "react";
import { useDealerContext } from "../context/dealerContext";
import citiesData from "../data/cities.json";

interface City {
  city: string;
  country: string;
  population?: number;
}

export default function CitySelect() {
  const { search, setSearch } = useDealerContext();

  const filteredCities: string[] = useMemo(() => {
    if (!search || search.length < 1) return [];

    const filtered = (citiesData as City[]).filter((c) =>
      c.city.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.slice(0, 20).map((c) => `${c.city}, ${c.country}`);
  }, [search]);

  return (
    <Autocomplete
      size="md"
      placeholder="Enter city"
      className="flex-1"
      w={400}
      autoSelectOnBlur
      value={search}
      onChange={setSearch}
      data={filteredCities}
      rightSection={
        <ActionIcon color="black" variant="transparent" type="submit">
          <IconSearch size={20} />
        </ActionIcon>
      }
    />
  );
}
