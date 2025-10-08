import { Button } from "@mantine/core";
import {
  IconPhone,
  IconRoute,
  IconShoppingCart,
  IconWorld,
  IconZoomScan,
} from "@tabler/icons-react";
import { Dealer } from "../lib/interfaces";
import { getHref } from "../lib/utils";

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
  const address = `${retailer.postalAddress.street}, ${retailer.postalAddress.zip} ${retailer.postalAddress.city}`;

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
  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 border-t border-[var(--main)] ${
        active ? "bg-[var(--background-subtle)]" : ""
      } hover:bg-[var(--background-subtle)] cursor-pointer transition-all`}
      tabIndex={0}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold tracking-tight">{retailer.name1}</h3>
          <span className="text-[10px] font-mono tracking-tighter dimmed">
            {retailer.coordinates.distance?.toFixed(0)}km
          </span>
        </div>
        {active && <p className="text-xs">{address}</p>}
      </header>
      {active && (
        <>
          <div className="flex flex-col gap-2">
            {data.map(
              (d, i) =>
                d.address && (
                  <a
                    key={i}
                    href={d.href!}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-2 items-center link text-xs"
                  >
                    <d.icon size={16} />
                    {d.label}
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
        </>
      )}
    </div>
  );
}
