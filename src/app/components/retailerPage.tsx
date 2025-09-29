"use client";
import { ActionIcon, Button, Select } from "@mantine/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { IconChevronRight, IconCurrentLocation } from "@tabler/icons-react";
import pluralize from "pluralize";
import { useEffect, useRef, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
import { Dealer, Location } from "../lib/interfaces";
import { getZoomLevel } from "../lib/utils";
import { mapStyles } from "../styles/map";
import CitySelect from "./citySelect";
import { Retailer } from "./retailer";
import RetailerPin from "./retailerPin";

export default function RetailerPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const { brand, campaign, search, submittedSearch } = useDealerContext();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [pendingFilter, setPendingFilter] = useState(false);
  const [distance, setDistance] = useState<string | null>("500000");

  const retailerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastCenterRef = useRef<{ lat: number; lng: number } | null>(null);
  const lastZoomRef = useRef<number | null>(null);

  const handleRetailerClick = (id: string, scroll?: boolean) => {
    if (selectedRetailer === id) {
      setSelectedRetailer("");
    } else {
      if (!showSidebar) {
        setShowSidebar(true);
      }
      setTimeout(() => {
        setSelectedRetailer(id);
        const el = retailerRefs.current[id];
        if (el && scroll) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
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
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          map.panTo(loc);
          map.setZoom(10);
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

  const handleIdle = () => {
    if (!map) return;

    const newCenter = map.getCenter();
    const newZoom = map.getZoom();
    if (!newCenter || !newZoom) return;

    const center = { lat: newCenter.lat(), lng: newCenter.lng() };

    const lastCenter = lastCenterRef.current;
    const lastZoom = lastZoomRef.current;

    const centerChanged =
      !lastCenter ||
      lastCenter.lat !== center.lat ||
      lastCenter.lng !== center.lng;
    const zoomChanged = lastZoom !== null && lastZoom !== newZoom;

    if (centerChanged || zoomChanged) {
      setShowSearchButton(true);
    }

    lastCenterRef.current = center;
    lastZoomRef.current = newZoom;

    if (pendingFilter) {
      filterRetailers();
      setPendingFilter(false);
    }
  };

  const handleSearchSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!map) return;

    if (search) {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address: search });
      if (result.results.length > 0) {
        const loc = result.results[0].geometry.location;
        setLocation({
          latitude: loc.lat(),
          longitude: loc.lng(),
        });
        map.panTo(loc);
        map.setZoom(10);
      }
    }

    filterRetailers();
  };

  const handleAreaSubmit = () => {
    if (!map) return;
    filterRetailers();
  };

  const filterRetailers = async () => {
    if (!map) return;
    const latLng = map.getCenter();
    if (!latLng) return;

    const res = await fetch("/api/dealer", {
      method: "POST",
      body: JSON.stringify({
        brands: brand,
        campagne: campaign?.id,
        latitude: latLng.lat() || location!.latitude,
        longitude: latLng.lng() || location!.longitude,
        distance: +distance! / 1000,
      }),
    });
    const dealers = await res.json();
    setRetailers(dealers);
    setTimeout(() => setShowSearchButton(false), 900);
  };

  useEffect(() => {
    if (map && retailers.length > 0 && location) {
      filterRetailers();
      setPendingFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, location, brand]);

  useEffect(() => {
    if (!map || !submittedSearch) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: submittedSearch }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        setLocation({
          latitude: loc.lat(),
          longitude: loc.lng(),
        });
        map.panTo(loc);
        map.setZoom(10);
        setPendingFilter(true);
      }
    });
  }, [map, submittedSearch]);

  useEffect(() => {
    if (!map || !distance) return;

    const zoom = getZoomLevel(Number(distance));
    map.setZoom(zoom);
  }, [distance, map]);

  useEffect(() => {
    if (map) {
      setTimeout(() => filterRetailers(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, brand, campaign, distance]);

  if (!isLoaded) return null;

  return (
    <main className="relative flex flex-col md:flex-row">
      <div
        className={`${showSidebar ? "w-full md:w-[480px]" : "w-0"} p-4 ${
          campaign ? "pt-40 md:pt-28" : "pt-28 md:pt-16"
        }  flex flex-col gap-8 gradient max-h-screen overflow-y-scroll transition-all duration-300`}
        style={
          showSidebar
            ? {
                transform: "translateX(0)",
              }
            : { transform: "translateX(-480px)" }
        }
      >
        <div className="flex flex-col">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center shadow-lg"
          >
            <CitySelect />
          </form>
          <div className="flex justify-between">
            <Button
              variant="transparent"
              color="black"
              onClick={handleGetUserLocation}
              leftSection={<IconCurrentLocation size={16} />}
            >
              Use current location
            </Button>
            <Select
              variant="unstyled"
              data={[
                { label: "100km", value: "100000" },
                { label: "200km", value: "200000" },
                { label: "500km", value: "500000" },
              ]}
              value={distance}
              onChange={setDistance}
              w={80}
              withCheckIcon={false}
              allowDeselect={false}
            />
          </div>
        </div>
        {retailers.length > 0 ? (
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-center">
              {retailers.length} retail{" "}
              {pluralize("location", retailers.length)}
            </p>
            {retailers
              .sort(
                (a, b) =>
                  (a.coordinates.distance || 0) - (b.coordinates.distance || 0)
              )
              .map((retailer, index) => (
                <Retailer
                  key={index}
                  retailer={retailer}
                  handleRetailerClick={handleRetailerClick}
                  active={retailer.kdnr === selectedRetailer}
                  innerRef={(el) => {
                    retailerRefs.current[retailer.kdnr] = el;
                  }}
                  map={map}
                />
              ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="text-xs dimmed small">No dealers found.</p>
          </div>
        )}
      </div>
      <div className="relative w-full h-screen">
        <div
          className={`hidden md:block absolute left-0 ${
            campaign ? "top-28" : "top-16"
          } z-30 backdrop-blur-md`}
        >
          <ActionIcon
            size="input-md"
            variant="light"
            color="gray"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <IconChevronRight
              size={20}
              className={`${
                showSidebar ? "rotate-180" : "rotate-0"
              } transition-all duration-300`}
            />
          </ActionIcon>
        </div>
        {showSearchButton && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <Button size="xs" color="black" onClick={handleAreaSubmit}>
              Search this area
            </Button>
          </div>
        )}
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyles,
          }}
          onLoad={(mapInstance) => {
            setMap(mapInstance);
            mapInstance.setCenter({ lat: 51.165691, lng: 10.451526 });
            mapInstance.setZoom(6.8);
          }}
          onIdle={handleIdle}
        >
          {retailers.length > 0 &&
            retailers.map((retailer, index) => {
              return (
                <RetailerPin
                  key={index}
                  retailer={retailer}
                  selectedRetailer={selectedRetailer}
                  handleRetailerClick={handleRetailerClick}
                />
              );
            })}
          {location && (
            <Marker
              position={{ lat: location.latitude, lng: location.longitude }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: "#000000",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 1,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </main>
  );
}
