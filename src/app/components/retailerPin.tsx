import { Button, Popover } from "@mantine/core";
import { OverlayView } from "@react-google-maps/api";
import { Dispatch, SetStateAction, useState } from "react";
import { Dealer } from "../lib/interfaces";

export default function RetailerPin({
  retailer,
  selectedRetailer,
  handleRetailerClick,
  showSidebar,
  setShowSidebar,
}: {
  retailer: Dealer;
  selectedRetailer: string;
  handleRetailerClick: (id: string) => void;
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  const [opened, setOpened] = useState(false);

  if (!retailer.addresse.latitude || !retailer.addresse.longitude) return null;

  return (
    <OverlayView
      position={{
        lat: Number(retailer.addresse.latitude.replace(",", ".")),
        lng: Number(retailer.addresse.longitude.replace(",", ".")),
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <Popover
        opened={opened}
        onChange={setOpened}
        width={280}
        position="top"
        withArrow
        shadow="xl"
        withinPortal
      >
        <Popover.Target>
          <div
            onClick={() => {
              setOpened((o) => !o);
              handleRetailerClick(retailer.kdnr);
            }}
            style={{
              width: retailer.kdnr === selectedRetailer ? 20 : 12,
              height: retailer.kdnr === selectedRetailer ? 20 : 12,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              backgroundColor: "#ef233c",
              opacity: retailer.kdnr === selectedRetailer ? 1 : 0.5,
              cursor: "pointer",
            }}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <div className="flex flex-col gap-4">
            <header>
              <h3 className="text-xl font-bold tracking-tight">
                {retailer.addresse.name1}
              </h3>
              <p className="text-xs text-black/60">
                {retailer.addresse.strasse}, {retailer.addresse.plz}{" "}
                {retailer.addresse.ort}
              </p>
            </header>
            {!showSidebar && (
              <Button
                size="xs"
                variant="light"
                fullWidth
                onClick={() => {
                  setShowSidebar(true);
                  setOpened(false);
                }}
              >
                More information
              </Button>
            )}
          </div>
        </Popover.Dropdown>
      </Popover>
    </OverlayView>
  );
}
