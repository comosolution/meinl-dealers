"use client";
import OnlinePage from "./components/onlinePage";
import RetailerPage from "./components/retailerPage";
import { useDealerContext } from "./context/dealerContext";

export default function Page() {
  const { type } = useDealerContext();

  return type === "retail" ? <RetailerPage /> : <OnlinePage />;
}
