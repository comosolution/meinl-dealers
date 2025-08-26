import { Popover } from "@mantine/core";
import { OverlayView } from "@react-google-maps/api";
import Image from "next/image";
import { Dealer } from "../lib/interfaces";

export default function RetailerPin({
  retailer,
  selectedRetailer,
  handleRetailerClick,
}: {
  retailer: Dealer;
  selectedRetailer: string;
  handleRetailerClick: (id: string) => void;
}) {
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
        opened={retailer.kdnr === selectedRetailer}
        width={280}
        position="top"
        offset={2}
        shadow="xl"
        withinPortal
      >
        <Popover.Target>
          <div
            onClick={() => {
              handleRetailerClick(retailer.kdnr);
            }}
            style={{
              position: "relative",
              zIndex: retailer.kdnr === selectedRetailer ? 20 : 10,
              width: 20,
              height: 20,
              transform: "translate(-50%, -100%)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor:
                  retailer.kdnr === selectedRetailer ? "#ef233c" : "#000000",
              }}
            >
              <Image
                src="/logo_w.svg"
                alt="Meinl Logo"
                width={20}
                height={20}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: `8px solid ${
                  retailer.kdnr === selectedRetailer ? "#ef233c" : "#000000"
                }`,
              }}
            />
          </div>
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
          </div>
        </Popover.Dropdown>
      </Popover>
    </OverlayView>
  );
}
