"use client";
import { Button } from "@mantine/core";
import { IconChevronRight, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import BrandSelect from "./components/brandSelect";
import CitySelect from "./components/citySelect";
import Logo from "./components/logo";
import OnlinePage from "./components/onlinePage";
import RetailerPage from "./components/retailerPage";
import TypeSelect from "./components/typeSelect";
import { useDealerContext } from "./context/dealerContext";

export default function Page() {
  const { type, search, setSubmittedSearch } = useDealerContext();
  const [submitted, setSubmitted] = useState(false);

  if (!submitted) {
    return (
      <main className="gradient fixed w-screen h-screen z-50 flex flex-col justify-between items-center gap-8 p-8">
        <Logo />
        <form className="flex-1 flex flex-col gap-4 text-4xl">
          <div className="flex items-center gap-2">
            I&apos;m looking for {type === "retail" ? "a" : "an"}{" "}
            <TypeSelect large /> store{" "}
          </div>
          {type === "retail" && (
            <div className="flex items-center gap-2">
              in <CitySelect large />
            </div>
          )}{" "}
          <div className="flex items-center gap-2">
            that offers <BrandSelect large />.{" "}
          </div>
          <Button
            type="submit"
            size="xl"
            onClick={() => {
              setSubmittedSearch(search);
              setSubmitted(true);
            }}
            leftSection={<IconSearch size={24} />}
          >
            Show dealers
          </Button>
        </form>
        <Button
          color="white"
          variant="transparent"
          onClick={() => setSubmitted(true)}
          rightSection={<IconChevronRight size={20} />}
          className="justify-self-end"
        >
          Skip
        </Button>
      </main>
    );
  }

  return type === "retail" ? <RetailerPage /> : <OnlinePage />;
}
