"use client";
import { ActionIcon, Autocomplete, Button, ComboboxItem } from "@mantine/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  IconCurrentLocation,
  IconPhone,
  IconSearch,
  IconWorld,
} from "@tabler/icons-react";
import { getDistance } from "geolib";
import { useEffect, useRef, useState } from "react";
import Logo from "./components/logo";
import { germanCitiesAbove50000 } from "./data/cities";
import { Dealer } from "./lib/interfaces";
import mapStyles from "./styles/map.json";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: mapStyles,
};

export default function Page() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [value, setValue] = useState("");
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [filteredRetailers, setFilteredRetailers] = useState<Dealer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [pendingFilter, setPendingFilter] = useState(false);
  const retailerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    getRetailers();
  }, []);

  const getRetailers = async () => {
    const res = await fetch("/api/dealer", { method: "POST" });
    const dealers = await res.json();
    setRetailers(dealers);
  };

  const handleRetailerClick = (id: string) => {
    if (selectedRetailer === id) {
      setSelectedRetailer("");
    } else {
      setSelectedRetailer(id);
      const el = retailerRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleGetUserLocation = () => {
    if (!map) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.panTo(loc);
          map.setZoom(9);
          setPendingFilter(true);
        },
        (err) => {
          console.error(`Error getting location: ${err.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getRadiusFromMap = (map: google.maps.Map) => {
    const bounds = map.getBounds();
    if (!bounds) return null;

    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const latNorth = getDistance(
      { latitude: center.lat(), longitude: center.lng() },
      { latitude: ne.lat(), longitude: center.lng() }
    );
    const latSouth = getDistance(
      { latitude: center.lat(), longitude: center.lng() },
      { latitude: sw.lat(), longitude: center.lng() }
    );
    const lngEast = getDistance(
      { latitude: center.lat(), longitude: center.lng() },
      { latitude: center.lat(), longitude: ne.lng() }
    );
    const lngWest = getDistance(
      { latitude: center.lat(), longitude: center.lng() },
      { latitude: center.lat(), longitude: sw.lng() }
    );

    const halfHeight = Math.min(latNorth, latSouth);
    const halfWidth = Math.min(lngEast, lngWest);

    return Math.min(halfHeight, halfWidth);
  };

  const handleSearchSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!map) return;

    if (value) {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address: value });
      if (result.results.length > 0) {
        const loc = result.results[0].geometry.location;
        map.panTo(loc);
        map.setZoom(9);
      }
    }

    filterRetailers();
  };

  const handleAreaSubmit = () => {
    if (!map) return;
    filterRetailers();
  };

  const filterRetailers = () => {
    if (!map) return;
    const latLng = map.getCenter();
    if (!latLng) return;

    const centerCoords = { lat: latLng.lat(), lng: latLng.lng() };
    let effectiveDistance = 50000;

    const radius = getRadiusFromMap(map);
    if (radius) effectiveDistance = radius;

    const nearbyRetailers = retailers.filter((retailer) => {
      if (retailer.addresse.latitude && retailer.addresse.longitude) {
        const dealerDistance = getDistance(
          { latitude: centerCoords.lat, longitude: centerCoords.lng },
          {
            latitude: Number(retailer.addresse.latitude.replace(",", ".")),
            longitude: Number(retailer.addresse.longitude.replace(",", ".")),
          }
        );
        return dealerDistance <= effectiveDistance;
      }
      return false;
    });

    setFilteredRetailers(nearbyRetailers);
    setShowSearchButton(false);
  };

  if (!isLoaded) return null;

  return (
    <main className="flex">
      <div className="w-1/2 flex flex-col items-start gap-4 p-8 shadow-2xl shadow-black max-h-screen overflow-y-scroll">
        <Logo />
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex items-center gap-1"
        >
          <Autocomplete
            placeholder="Enter city"
            className="flex-1"
            value={value}
            onChange={setValue}
            data={germanCitiesAbove50000}
            filter={({ options, search }) => {
              const filtered = (options as ComboboxItem[]).filter((option) =>
                option.label
                  .toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim())
              );

              filtered.sort((a, b) => a.label.localeCompare(b.label));
              return filtered;
            }}
          />
          <ActionIcon.Group>
            <ActionIcon type="submit" size="lg">
              <IconSearch size={20} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              size="lg"
              onClick={handleGetUserLocation}
            >
              <IconCurrentLocation size={20} />
            </ActionIcon>
          </ActionIcon.Group>
        </form>

        <div className="w-full flex flex-col gap-2">
          {filteredRetailers.map((retailer, index) => (
            <Retailer
              key={index}
              retailer={retailer}
              handleRetailerClick={handleRetailerClick}
              active={retailer.kdnr === selectedRetailer}
              innerRef={(el) => {
                retailerRefs.current[retailer.kdnr] = el;
              }}
            />
          ))}
          {filteredRetailers.length < 1 && <></>}
        </div>
      </div>

      <div className="relative w-full h-screen">
        {showSearchButton && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 shadow-2xl shadow-black">
            <Button onClick={handleAreaSubmit}>Search this area</Button>
          </div>
        )}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          options={mapOptions}
          onLoad={(mapInstance) => {
            setMap(mapInstance);
            mapInstance.setCenter({ lat: 51.165691, lng: 10.451526 });
            mapInstance.setZoom(6.8);
          }}
          onIdle={() => {
            setShowSearchButton(true);
            if (pendingFilter) {
              filterRetailers();
              setPendingFilter(false);
            }
          }}
        >
          {filteredRetailers.map((retailer, index) => {
            if (!retailer.addresse.latitude || !retailer.addresse.longitude)
              return null;

            return (
              <Marker
                key={index}
                position={{
                  lat: Number(retailer.addresse.latitude.replace(",", ".")),
                  lng: Number(retailer.addresse.longitude.replace(",", ".")),
                }}
                onClick={() => handleRetailerClick(retailer.kdnr)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: retailer.kdnr === selectedRetailer ? 12 : 8,
                  fillColor: "#ef233c",
                  fillOpacity: retailer.kdnr === selectedRetailer ? 1 : 0,
                  strokeWeight: 1.5,
                  strokeColor: "#ef233c",
                }}
              />
            );
          })}
        </GoogleMap>
      </div>
    </main>
  );
}

function Retailer({
  retailer,
  handleRetailerClick,
  active,
  innerRef,
}: {
  retailer: Dealer;
  handleRetailerClick: (id: string) => void;
  active: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
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
      label: "Website",
      href: retailer.addresse.www,
    },
  ];

  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 border ${
        active ? "border-[var(--main)]" : "border-black/10"
      }`}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col">
        <h3 className="text-xl font-bold tracking-tight">
          {retailer.addresse.name1}
        </h3>
        <p className="text-xs text-black/60">{address}</p>
      </header>
      {/* <div className="flex gap-8">
        {data.map((d, i) => (
          <a
            key={i}
            href={d.href || ""}
            target="_blank"
            className="flex flex-col items-center gap-1"
          >
            <d.icon size={32} stroke={1.5} />
            <p>{d.label}</p>
          </a>
        ))}
      </div> */}
      {/* <div className="flex flex-wrap gap-1">
        {retailer.warengruppen.map(
          (w, i) =>
            w.wgr1 !== "" && (
              <p
                key={i}
                className="text-xs px-2 py-1 bg-white shadow-black/20 ring-1 ring-neutral-300 shadow-2xl"
              >
                {w.wgr1} {w.wgr2} {w.wgr3} {w.wgr4} {w.wgr5}
              </p>
            )
        )}
      </div> */}
    </div>
  );
}
