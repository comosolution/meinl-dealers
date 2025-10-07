import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getZoomLevel(distanceMeters: number): number {
  const scale = distanceMeters / 1000;
  return Math.max(2, Math.min(15, Math.floor(16 - Math.log2(scale))));
}

export function getHref(www: string): string {
  return www.startsWith("http") ? www : `https://${www}`;
}
