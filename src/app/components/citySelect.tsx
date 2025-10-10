"use client";
import { ActionIcon, Autocomplete } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDealerContext } from "../context/dealerContext";

export default function CitySelect() {
  const { search, setSearch } = useDealerContext();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length < 2) {
        setData([]);
        return;
      }

      try {
        const res = await fetch(`/api/cities?q=${encodeURIComponent(search)}`);
        const { cities } = await res.json();
        setData(cities);
      } catch (err) {
        console.error("Failed to fetch cities", err);
        setData([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <Autocomplete
      size="md"
      placeholder="Enter city"
      className="flex-1"
      w={400}
      value={search}
      onChange={setSearch}
      data={data}
      rightSection={
        <ActionIcon color="black" variant="transparent" type="submit">
          <IconSearch size={20} />
        </ActionIcon>
      }
    />
  );
}
