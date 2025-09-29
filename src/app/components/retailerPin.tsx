import { OverlayView } from "@react-google-maps/api";
import Image from "next/image";
import { useDealerContext } from "../context/dealerContext";
import { Dealer } from "../lib/interfaces";

export default function RetailerPin({
  retailer,
  selectedRetailer,
  handleRetailerClick,
}: {
  retailer: Dealer;
  selectedRetailer: string;
  handleRetailerClick: (id: string, scroll?: boolean) => void;
}) {
  const { brand } = useDealerContext();

  if (!retailer.coordinates.latitude || !retailer.coordinates.longitude)
    return null;

  return (
    <OverlayView
      position={{
        lat: retailer.coordinates.latitude,
        lng: retailer.coordinates.longitude,
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={() => {
          handleRetailerClick(retailer.kdnr, true);
        }}
        style={{
          position: "relative",
          zIndex: retailer.kdnr === selectedRetailer ? 20 : 10,
          width: 36,
          height: 36,
          transform: "translate(-50%, -100%)",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "2px",
            backgroundColor:
              retailer.kdnr === selectedRetailer ? "var(--main)" : "#000000",
          }}
          className="flex items-center"
        >
          <Image
            src={
              brand
                ? `/brands/${brand.replaceAll(" ", "-").toUpperCase()}.png`
                : "/logo_w.svg"
            }
            alt="Meinl Logo"
            width={32}
            height={32}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 0,
            height: 0,
            borderLeft: "18px solid transparent",
            borderRight: "18px solid transparent",
            borderTop: `8px solid ${
              retailer.kdnr === selectedRetailer ? "var(--main)" : "#000000"
            }`,
          }}
        />
      </div>
    </OverlayView>
  );
}
