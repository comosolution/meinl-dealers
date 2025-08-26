"use client";
import { ActionIcon, Button } from "@mantine/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { IconChevronRight, IconCurrentLocation } from "@tabler/icons-react";
import { getDistance } from "geolib";
import { useEffect, useRef, useState } from "react";
import { useDealerContext } from "../context/dealerContext";
import { Dealer, Location } from "../lib/interfaces";
import { mapStyles } from "../styles/map";
import CitySelect from "./citySelect";
import { Retailer } from "./retailer";
import RetailerPin from "./retailerPin";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: mapStyles,
};

export default function RetailerPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const { search, submittedSearch } = useDealerContext();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [retailers, setRetailers] = useState<Dealer[]>([]);
  const [filteredRetailers, setFilteredRetailers] = useState<Dealer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
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
    let effectiveDistance = 30000;

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
    setTimeout(() => setShowSearchButton(false), 900);
  };

  useEffect(() => {
    if (map && retailers.length > 0 && location) {
      filterRetailers();
      setPendingFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, retailers, location]);

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
        map.setZoom(9);
        setPendingFilter(true);
      }
    });
  }, [map, submittedSearch]);

  if (!isLoaded) return null;

  return (
    <main className="relative flex">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex items-center shadow-md shadow-black/20"
        >
          <CitySelect />
          <ActionIcon
            color="black"
            size="input-sm"
            onClick={handleGetUserLocation}
          >
            <IconCurrentLocation size={20} />
          </ActionIcon>
        </form>
        {showSearchButton && (
          <div className="backdrop-blur-md">
            <Button size="xs" variant="light" onClick={handleAreaSubmit}>
              Search this area
            </Button>
          </div>
        )}
      </div>
      <div
        className="bg-[var(--foreground)] text-white max-h-screen overflow-y-scroll transition-all duration-300"
        style={
          showSidebar
            ? {
                transform: "translateX(0)",
                width: "420px",
                padding: "64px 16px",
              }
            : { transform: "translateX(-420px)", width: "0" }
        }
      >
        {filteredRetailers.length > 0 ? (
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-center">
              {filteredRetailers.length} locations
            </h2>
            {filteredRetailers.map((retailer, index) => (
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
            {filteredRetailers.length < 1 && <></>}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="text-xs dimmed small">No dealers found.</p>
          </div>
        )}
      </div>
      <div className="relative w-full h-screen">
        <div className="absolute left-0 top-16 z-50">
          <ActionIcon
            size="input-sm"
            color="black"
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
                fillColor: "#ef233c",
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
