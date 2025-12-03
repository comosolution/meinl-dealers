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

export const normalizeCountryCode = (input: string): string | null => {
  if (!input) return null;
  const code = input.trim().toUpperCase();

  const manualMap: Record<string, string> = {
    D: "DE",
    A: "AT",
    CH: "CH",
    NL: "NL",
    B: "BE",
    F: "FR",
    GB: "GB",
    UK: "GB",
  };
  if (manualMap[code]) return manualMap[code];

  const isoAlpha3to2: Record<string, string> = {
    DEU: "DE",
    AUT: "AT",
    CHE: "CH",
    FRA: "FR",
    NLD: "NL",
    BEL: "BE",
    USA: "US",
    CAN: "CA",
    GBR: "GB",
    ITA: "IT",
    ESP: "ES",
  };
  if (isoAlpha3to2[code]) return isoAlpha3to2[code];

  if (/^[A-Z]{2}$/.test(code)) return code;

  return null;
};
