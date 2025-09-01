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
      href: retailer.www,
    },
  ];
  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 border ${
        active ? "border-[var(--main)]" : "border-transparent"
      } bg-[var(--background)] cursor-pointer`}
      tabIndex={0}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xl font-bold tracking-tight">{retailer.name1}</h3>
          <span className="text-[10px] font-mono tracking-tighter">
            {retailer.coordinates.distance?.toFixed(0)}km
          </span>
        </div>
        {active && <p className="text-xs dimmed">{address}</p>}
      </header>
      {active && (
        <>
          <div className="flex justify-center items-center">
            {data.map(
              (d, i) =>
                d.address && (
                  <a
                    key={i}
                    href={d.href!}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="link w-1/2 flex flex-col items-center gap-1"
                  >
                    <d.icon size={24} stroke={1.5} />
                    <p className="text-xs">{d.label}</p>
                  </a>
                )
            )}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {retailer.brands.map((b, i) => (
              <div key={i} className="flex gap-1 items-center">
                <Image
                  src={`/brands/${b.title.replaceAll(" ", "-")}.png`}
                  width={16}
                  height={16}
                  alt={b.title}
                  className="inverted"
                />
                <p className="text-xs tracking-tighter">{b.title}</p>
              </div>
            ))}
          </div>
          <Button.Group>
            <Button
              size="xs"
              color="gray"
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
              variant="transparent"
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
                map.setZoom(11);
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
