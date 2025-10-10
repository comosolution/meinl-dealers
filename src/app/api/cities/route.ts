import { NextResponse } from "next/server";

interface GeoName {
  name: string;
  countryName: string;
  lat: string;
  lng: string;
  alternateNames?: GeoAlternateName[];
}

interface GeoAlternateName {
  name: string;
  lang?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) return NextResponse.json({ cities: [] });

  const username = process.env.GEONAMES_USERNAME;
  if (!username) {
    throw new Error("GeoNames username is not set in environment variables");
  }

  const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(
    query
  )}&maxRows=20&cities=cities1000&username=${username}&style=full`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ cities: [] });

  const data: { geonames: GeoName[] } = await res.json();

  const nameSet = new Set<string>();

  data.geonames.forEach((c) => {
    if (c.name && !c.name.startsWith("http")) {
      nameSet.add(`${c.name}, ${c.countryName}`);
    }

    if (c.alternateNames) {
      c.alternateNames.forEach((alt) => {
        if (
          alt.name &&
          !alt.name.startsWith("http") &&
          (alt.lang === "en" || alt.lang === "de")
        ) {
          nameSet.add(`${alt.name}, ${c.countryName}`);
        }
      });
    }
  });

  const cities = Array.from(nameSet);

  return NextResponse.json({ cities });
}
