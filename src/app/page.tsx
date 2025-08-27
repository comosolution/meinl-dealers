"use client";
import { Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
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

  return (
    <>
      <main
        className={`gradient fixed w-screen h-screen z-50 flex flex-col justify-between items-center gap-8 p-4 ${
          submitted ? "-translate-y-[100%]" : "translate-y-0 shadow-2xl"
        } transition-all duration-300`}
      >
        <Logo />
        <form
          className="flex-1 flex flex-col gap-4 text-4xl"
          onSubmit={(e) => {
            e.preventDefault();

            setSubmittedSearch(search);
            setSubmitted(true);
          }}
        >
          <div className="flex items-center gap-2">
            I&apos;m looking for
            <TypeSelect large /> stores
          </div>
          <div className="flex items-center gap-2">
            that offer <BrandSelect large />
          </div>
          {type === "retail" && (
            <div className="flex items-center gap-2">
              in <CitySelect large />
            </div>
          )}
          <Button
            type="submit"
            size="xl"
            leftSection={<IconSearch size={24} />}
          >
            Show dealers
          </Button>
        </form>
        <Button
          color="white"
          variant="transparent"
          onClick={() => setSubmitted(true)}
        >
          Skip
        </Button>
      </main>
      {!submitted && (
        <div className="absolute inset-0 z-40 backdrop-blur bg-black/10" />
      )}
      {type === "retail" ? <RetailerPage /> : <OnlinePage />}
    </>
  );
}
