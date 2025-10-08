import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHref(www: string): string {
  return www.startsWith("http") ? www : `https://${www}`;
}

export const getZoomLevel = (distance: number) => {
  const distanceZoomMap: Record<number, number> = {
    100_000: 9,
    200_000: 8,
    300_000: 7,
    400_000: 6,
    500_000: 5,
  };

  return distanceZoomMap[distance] || 9;
};

export const getDistanceFromZoom = (zoom: number) => {
  const zoomDistanceMap: Record<number, number> = {
    9: 100_000,
    8: 200_000,
    7: 300_000,
    6: 400_000,
    5: 500_000,
  };

  return zoomDistanceMap[zoom] || 100_000;
};
