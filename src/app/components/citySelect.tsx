import { ActionIcon, Autocomplete, ComboboxItem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useDealerContext } from "../context/dealerContext";
import { germanCitiesAbove50000 } from "../data/cities";

export default function CitySelect() {
  const { search, setSearch } = useDealerContext();

  return (
    <Autocomplete
      variant="filled"
      size="md"
      placeholder="Enter your city"
      className="flex-1"
      styles={{ input: { background: "white" } }}
      w={400}
      value={search}
      onChange={setSearch}
      data={germanCitiesAbove50000}
      filter={({ options, search }) => {
        const filtered = (options as ComboboxItem[]).filter((option) =>
          option.label
            .toLowerCase()
            .trim()
            .includes(search.toLowerCase().trim())
        );

        filtered.sort((a, b) => a.label.localeCompare(b.label));
        return filtered;
      }}
      rightSection={
        <ActionIcon color="black" variant="transparent" type="submit">
          <IconSearch size={20} />
        </ActionIcon>
      }
    />
  );
}
