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
  handleRetailerClick: (id: string, scroll?: boolean) => void;
}) {
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
          <Image src="/logo_w.svg" alt="Meinl Logo" width={20} height={20} />
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
    </OverlayView>
  );
}
