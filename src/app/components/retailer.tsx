import { Button } from "@mantine/core";
import {
  IconPhone,
  IconRoute,
  IconWorld,
  IconZoomScan,
} from "@tabler/icons-react";
import Image from "next/image";
import { Dealer } from "../lib/interfaces";

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
      label: retailer.phone,
      address: retailer.phone,
      href: `tel:${retailer.phone}`,
    },
    {
      icon: IconWorld,
      label: "Visit website",
      address: retailer.www,
      href: retailer.www.startsWith("http")
        ? retailer.www
        : `https://${retailer.www}`,
    },
  ];
  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 ${
        active ? "bg-[var(--background)] shadow-xl" : ""
      } hover:bg-[var(--background)] cursor-pointer`}
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
              color="gray"
              variant="light"
              leftSection={<IconZoomScan size={16} />}
              onClick={(e) => {
                e.stopPropagation();
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
          <div className="grid grid-cols-2 gap-2">
            {retailer.brands.map((b, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Image
                  src={`/brands/${b.replaceAll(" ", "-")}.png`}
                  width={16}
                  height={16}
                  alt={b}
                  className="inverted"
                />
                <p className="text-xs tracking-tighter">{b}</p>
              </div>
            ))}
          </div>
          <Button.Group>
            {data.map(
              (d, i) =>
                d.address && (
                  <Button
                    key={i}
                    size="xs"
                    variant="transparent"
                    component="a"
                    href={d.href!}
                    target="_blank"
                    leftSection={<d.icon size={16} />}
                    onClick={(e) => e.stopPropagation()}
                    fullWidth
                  >
                    {d.label}
                  </Button>
                )
            )}
          </Button.Group>
        </>
      )}
    </div>
  );
}
