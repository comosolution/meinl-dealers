import { Button } from "@mantine/core";
import {
  IconPhone,
  IconRoute,
  IconShoppingCart,
  IconWorld,
  IconZoomScan,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Dealer } from "../lib/interfaces";
import { getHref, normalizeCountryCode } from "../lib/utils";

export function Retailer({
  retailer,
  handleRetailerClick,
  active,
  innerRef,
  map,
}: {
  retailer: Dealer;
  handleRetailerClick: (id: string) => void;
  active: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
  map: google.maps.Map | null;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const data = [
    {
      icon: IconPhone,
      label: `Call ${retailer.phone}`,
      address: retailer.phone,
      href: `tel:${retailer.phone}`,
    },
    {
      icon: IconWorld,
      label: "Visit website",
      address: retailer.www,
      href: getHref(retailer.www),
    },
    {
      icon: IconShoppingCart,
      label: "Shop online",
      address: retailer.shopUrl,
      href: getHref(retailer.shopUrl),
    },
  ];

  const address = `${retailer.postalAddress.street}, ${
    retailer.postalAddress.zip
  } ${retailer.postalAddress.city} ${normalizeCountryCode(
    retailer.postalAddress.country
  )}`;

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [retailer, active]);

  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 ${
        active ? "" : "pb-0"
      } border-t border-[var(--main)] cursor-pointer transition-all ${
        active
          ? "bg-[var(--background-subtle)]"
          : "hover:bg-[rgb(var(--main-rgb),0.1)]"
      }`}
      tabIndex={0}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col">
        <div className="flex justify-between items-center">
          <h2>{retailer.name1}</h2>
          <span className="text-[10px] font-mono tracking-tighter dimmed">
            {retailer.coordinates.distance?.toFixed(0)}km
          </span>
        </div>
        <p className="text-xs">{address}</p>
      </header>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: active ? contentHeight : 0 }}
      >
        <div ref={contentRef} className="flex flex-col gap-4">
          <hr className="opacity-10" />
          <div className="flex flex-col gap-1">
            {data.map(
              (d, i) =>
                d.address && (
                  <a
                    key={i}
                    href={d.href!}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-1 items-center link"
                  >
                    <d.icon size={16} stroke={1.5} />
                    <h3>{d.label}</h3>
                  </a>
                )
            )}
          </div>
          <Button.Group>
            <Button
              size="xs"
              color="black"
              leftSection={<IconRoute size={16} />}
              component="a"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                address
              )}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              fullWidth
            >
              Plan route
            </Button>
            <Button
              size="xs"
              color="black"
              variant="light"
              leftSection={<IconZoomScan size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                const mapEl = document.getElementById("map");
                if (mapEl) {
                  mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }

                if (!map) return;
                if (
                  !retailer.coordinates.latitude ||
                  !retailer.coordinates.longitude
                )
                  return;

                map.panTo({
                  lat: retailer.coordinates.latitude,
                  lng: retailer.coordinates.longitude,
                });
                map.setZoom(12);
              }}
              fullWidth
            >
              View on map
            </Button>
          </Button.Group>
        </div>
      </div>
    </div>
  );
}
