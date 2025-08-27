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
  const address = `${retailer.addresse.strasse}, ${retailer.addresse.plz} ${retailer.addresse.ort}`;

  const data = [
    {
      icon: IconPhone,
      label: retailer.addresse.telefon,
      href: `tel:${retailer.addresse.telefon}`,
    },
    {
      icon: IconWorld,
      label: retailer.addresse.www,
      href: retailer.addresse.www,
    },
  ];
  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 border ${
        active ? "border-[var(--main)]" : "border-black/20"
      }`}
      tabIndex={0}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col items-center text-center">
        <h3 className="text-xl font-bold tracking-tight">
          {retailer.addresse.name1}
        </h3>
        <p className="text-xs dimmed">{address}</p>
      </header>
      {active && (
        <>
          <Button.Group orientation="vertical">
            {data.map(
              (d, i) =>
                d.label && (
                  <Button
                    key={i}
                    size="xs"
                    variant="transparent"
                    component="a"
                    href={d.href!}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    leftSection={<d.icon size={16} />}
                    fullWidth
                  >
                    {d.label}
                  </Button>
                )
            )}
          </Button.Group>
          <div className="grid grid-cols-2 gap-1">
            {retailer.brands
              .sort((a, b) => a.sorting - b.sorting)
              .map((b, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <Image
                    src={`/brands/${b.wg.replace("B2BNEW-", "")}.png`}
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
                if (!retailer.addresse.latitude || !retailer.addresse.longitude)
                  return;

                map.panTo({
                  lat: Number(retailer.addresse.latitude.replace(",", ".")),
                  lng: Number(retailer.addresse.longitude.replace(",", ".")),
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
