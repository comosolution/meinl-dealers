"use client";
import { ActionIcon, Autocomplete, ComboboxItem, Select } from "@mantine/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  IconCurrentLocation,
  IconPhone,
  IconSearch,
  IconWorld,
} from "@tabler/icons-react";
import { getDistance } from "geolib";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Logo from "./components/logo";
import { germanCitiesAbove50000 } from "./data/cities";
import { Dealer } from "./lib/interfaces";
import mapStyles from "./styles/map.json";

interface Location {
  latitude: number;
  longitude: number;
}

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

  const [location, setLocation] = useState<Location | null>(null);
  const [center, setCenter] = useState({ lat: 51.165691, lng: 10.451526 });
  const [zoom, setZoom] = useState(6.8);
  const [distance, setDistance] = useState<string | null>("50000");
  const [value, setValue] = useState("");
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [filteredRetailers, setFilteredRetailers] = useState<Dealer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState("");

  useEffect(() => {
    getRetailers();
  }, []);

  const getRetailers = async () => {
    const res = await fetch("/api/dealer", {
      method: "POST",
    });
    const dealers = await res.json();
    setRetailers(dealers);
  };

  const handleRetailerClick = useCallback((id: string) => {
    setSelectedRetailer(id);
  }, []);

  const handleGetUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(9);
        },
        (err) => {
          console.error(`Error getting location: ${err.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address: value });

      if (result.results.length > 0) {
        const location = result.results[0].geometry.location;
        const latLng = { lat: location.lat(), lng: location.lng() };
        setCenter(latLng);
        setZoom(+distance! <= 100000 ? 9 : 7.5);

        const nearbyRetailers = retailers.filter((retailer) => {
          if (retailer.addresse.latitude && retailer.addresse.longitude) {
            const dealerDistance = getDistance(
              { latitude: latLng.lat, longitude: latLng.lng },
              {
                latitude: Number(retailer.addresse.latitude.replace(",", ".")),
                longitude: Number(
                  retailer.addresse.longitude.replace(",", ".")
                ),
              }
            );
            console.log(dealerDistance);
            return dealerDistance <= +distance!;
          } else {
            return false;
          }
        });
        setFilteredRetailers(nearbyRetailers);
      }
    } catch (error) {
      console.error("Error getting location", error);
    }
  };

  useEffect(() => {
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance]);

  if (!isLoaded) return <></>;

  return (
    <main className="flex">
      <div className="w-1/2 flex flex-col items-start gap-4 p-8 shadow-2xl shadow-black max-h-screen overflow-y-scroll">
        <Logo />
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Autocomplete
            placeholder="Enter address"
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
          <Select
            value={distance}
            onChange={setDistance}
            data={[
              { label: "50 km", value: "50000" },
              { label: "100 km", value: "100000" },
              { label: "200 km", value: "200000" },
            ]}
            allowDeselect={false}
            checkIconPosition="right"
            w={120}
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
        <div className="flex flex-col gap-2">
          {filteredRetailers.map((retailer, index) => (
            <Retailer
              key={index}
              retailer={retailer}
              handleRetailerClick={handleRetailerClick}
              active={retailer.kdnr === selectedRetailer}
            />
          ))}
          {filteredRetailers.length < 1 && <></>}
        </div>
      </div>
      <div className="w-full h-screen">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
          options={mapOptions}
        >
          {filteredRetailers.map((retailer, index) => {
            if (!retailer.addresse.latitude || !retailer.addresse.longitude)
              return;

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
                  scale: retailer.kdnr === selectedRetailer ? 16 : 12,
                  fillColor: "#d2934d",
                  fillOpacity: retailer.kdnr === selectedRetailer ? 1 : 0.66,
                  strokeWeight: 2,
                }}
              />
            );
          })}
          {location && (
            <Marker
              position={{ lat: location.latitude, lng: location.longitude }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#ffffff",
                fillOpacity: 1,
                strokeWeight: 1,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </main>
  );
}

function Retailer({
  retailer,
  handleRetailerClick,
  active,
}: {
  retailer: Dealer;
  handleRetailerClick: (id: string) => void;
  active: boolean;
}) {
  const address = `${retailer.addresse.strasse}, ${retailer.addresse.plz}
          ${retailer.addresse.ort}`;

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
      className={`flex flex-col gap-4 p-4 border ${
        active ? "border-[var(--main)]" : "border-black/10"
      }`}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-xl font-bold tracking-tight">
          {retailer.addresse.name1}
        </h3>
        <p className="font-mono text-xs text-black/60">{address}</p>
      </header>
      <div className="flex flex-row gap-2">
        {data.map((d, i) => (
          <Link key={i} href={d.href || ""} className="flex">
            <d.icon size={20} />
            <p>{d.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {retailer.warengruppen.map(
          (w, index) =>
            w.wgr1 !== "" && (
              <p
                key={index}
                className="text-xs px-2 py-1 rounded bg-white shadow-black/20 ring-1 ring-neutral-300 shadow-2xl"
              >
                {w.wgr1} {w.wgr2} {w.wgr3} {w.wgr4} {w.wgr5}
              </p>
            )
        )}
      </div>
    </div>
  );
}
