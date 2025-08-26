import { Button } from "@mantine/core";
import {
  IconGlobe,
  IconMail,
  IconPhone,
  IconRoute,
  IconZoomScan,
} from "@tabler/icons-react";
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
      icon: IconMail,
      label: retailer.addresse.email,
      href: `mailto:${retailer.addresse.email}`,
    },
    {
      icon: IconGlobe,
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
      <header className="flex flex-col">
        <h3 className="text-xl font-bold tracking-tight">
          {retailer.addresse.name1}
        </h3>
        <p className="text-xs dimmed">{address}</p>
      </header>
      {active && (
        <>
          <nav className="flex flex-col gap-1">
            {data.map(
              (d, i) =>
                d.label && (
                  <a
                    key={i}
                    href={d.href!}
                    target="_blank"
                    className="link text-xs flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <d.icon size={16} stroke={1.5} /> {d.label}
                  </a>
                )
            )}
          </nav>
          <Button.Group>
            <Button
              size="xs"
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
              variant="light"
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
          {/* <div className="flex flex-wrap gap-1">
            {retailer.warengruppen.map(
              (w, i) =>
                w.wgr1 !== "" && (
                  <p
                    key={i}
                    className="text-xs px-2 py-1 shadow-black/20 ring-1 ring-neutral-300 shadow-2xl"
                  >
                    {w.wgr1} {w.wgr2} {w.wgr3} {w.wgr4} {w.wgr5}
                  </p>
                )
            )}
          </div> */}
        </>
      )}
    </div>
  );
}
