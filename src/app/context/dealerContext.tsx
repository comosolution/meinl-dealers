"use client";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconRefresh } from "@tabler/icons-react";
import { formatDistance, isAfter, isBefore } from "date-fns";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { brands } from "../data/data";
import { Campaign, UserLocation } from "../lib/interfaces";

type DealerMode = "retail" | "online" | "flagship";

interface DealerContextType {
  type: DealerMode;
  setType: (type: DealerMode) => void;
  brand: string | null;
  setBrand: (brand: string | null) => void;
  campaign: Campaign | undefined;
  setCampaign: (campaign: Campaign) => void;
  search: string;
  setSearch: (search: string) => void;
  submittedSearch: string | null;
  setSubmittedSearch: (search: string | null) => void;
  userLocation: UserLocation | null;
  setUserLocation: (userLocation: UserLocation | null) => void;
}

const DealerContext = createContext<DealerContextType | undefined>(undefined);

export function DealerProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<DealerMode>("retail");
  const [brand, setBrand] = useState<string | null>(brands[0]);
  const [campaign, setCampaign] = useState<Campaign>();
  const [search, setSearch] = useState<string>("");
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");
  const campaignParam =
    searchParams.get("campagne") || searchParams.get("campaign");

  const getCampaignDetails = async () => {
    const res = await fetch(`/api/campaign/${campaignParam}`);
    const data = await res.json();
    setCampaign(data[0]);
  };

  useEffect(() => {
    if (brandParam) {
      setBrand(
        brands.find((b) => b === brandParam?.replaceAll("-", " ")) || brands[0]
      );
    }
  }, [brandParam]);

  useEffect(() => {
    if (campaignParam) {
      getCampaignDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignParam]);

  useEffect(() => {
    if (!campaign) return;

    setBrand(campaign.brand);

    const now = new Date();
    const start = campaign.start ? new Date(campaign.start) : null;
    const end = campaign.end ? new Date(campaign.end) : null;

    const action = (
      <Button
        size="xs"
        color="black"
        variant="light"
        mt={8}
        leftSection={<IconRefresh size={12} />}
        onClick={() => {
          setCampaign(undefined);
          notifications.hide(`campaign-${campaignParam}`);
        }}
      >
        Show all {campaign.brand} dealers
      </Button>
    );

    if (start && isAfter(start, now)) {
      notifications.show({
        id: `campaign-${campaignParam}`,
        color: "black",
        title: campaign.title,
        message: (
          <>
            <p>
              This campaign will start{" "}
              {formatDistance(start, now, { addSuffix: true })}. Please come
              back later.
            </p>
            {action}
          </>
        ),
        autoClose: false,
      });
      return;
    }

    if (end && isBefore(end, now)) {
      notifications.show({
        id: `campaign-${campaignParam}`,
        color: "black",
        title: campaign.title,
        message: (
          <>
            <p>
              This campaign ended{" "}
              {formatDistance(end, now, { addSuffix: true })}.
            </p>
            {action}
          </>
        ),
        autoClose: false,
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  return (
    <DealerContext.Provider
      value={{
        type,
        setType,
        brand,
        setBrand,
        campaign,
        setCampaign,
        search,
        setSearch,
        submittedSearch,
        setSubmittedSearch,
        userLocation,
        setUserLocation,
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
