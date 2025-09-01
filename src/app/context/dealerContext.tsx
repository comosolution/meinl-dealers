"use client";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { brands } from "../data/brands";

type DealerMode = "retail" | "online";

interface DealerContextType {
  type: DealerMode;
  setType: (type: DealerMode) => void;
  brand: string | null;
  setBrand: (brand: string | null) => void;
  search: string;
  setSearch: (search: string) => void;
  submittedSearch: string | null;
  setSubmittedSearch: (search: string | null) => void;
}

const DealerContext = createContext<DealerContextType | undefined>(undefined);

export function DealerProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<DealerMode>("retail");
  const [brand, setBrand] = useState<string | null>(brands[0].value);
  const [search, setSearch] = useState<string>("");
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");

  useEffect(() => {
    if (brandParam) {
      setBrand(
        brands.find((b) => b.value === brandParam?.replaceAll("-", " "))
          ?.value || brands[0].value
      );
    }
  }, [brandParam]);

  return (
    <DealerContext.Provider
      value={{
        type,
        setType,
        brand,
        setBrand,
        search,
        setSearch,
        submittedSearch,
        setSubmittedSearch,
      }}
    >
      {children}
    </DealerContext.Provider>
  );
}

export function useDealerContext() {
  const context = useContext(DealerContext);
  if (!context) {
    throw new Error("useDealerContext must be used inside DealerProvider");
  }
  return context;
}
