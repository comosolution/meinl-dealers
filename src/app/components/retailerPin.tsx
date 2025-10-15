import { OverlayView } from "@react-google-maps/api";
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

  const isSelected = retailer.kdnr === selectedRetailer;

  return (
    <OverlayView
      position={{
        lat: retailer.coordinates.latitude,
        lng: retailer.coordinates.longitude,
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={() => handleRetailerClick(retailer.kdnr, true)}
        style={{
          position: "relative",
          width: 36,
          height: 36,
          transform: "translate(-50%, -100%)",
          cursor: "pointer",
          zIndex: isSelected ? 20 : 10,
          transition: "transform 0.2s ease",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="36"
          height="36"
          style={{
            display: "block",
            fill: isSelected ? "var(--main)" : "#000",
            transition: "fill 0.3s ease",
          }}
        >
          <path
            stroke="#fff"
            d="M16 0C9.4 0 4 5.4 4 12c0 7.5 9.6 18.7 11.5 20.8a.7.7 0 0 0 1 .1c1.9-2.1 11.5-13.3 11.5-20.9 0-6.6-5.4-12-12-12zm0 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
          />
        </svg>
      </div>
    </OverlayView>
  );
}
