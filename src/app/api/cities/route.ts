import { NextResponse } from "next/server";

interface GeoNameSimple {
  name: string; // default/English name
  toponymName: string; // official local name
  countryName: string;
  lat: string;
  lng: string;
  population?: number; // optional
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 1) return NextResponse.json({ cities: [] });

  const username = process.env.GEONAMES_USERNAME;
  if (!username) {
    throw new Error("GeoNames username is not set in environment variables");
  }

  const url = `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
    query
  )}&maxRows=50&cities=cities1000&username=${username}`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ cities: [] });

  const data: { geonames: GeoNameSimple[] } = await res.json();

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const normalizedQuery = normalize(query);

  const matchingCities = data.geonames.filter((c) => {
    const normalizedName = normalize(c.name);
    const normalizedToponym = normalize(c.toponymName);
    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedToponym.includes(normalizedQuery)
    );
  });

  matchingCities.sort((a, b) => (b.population || 0) - (a.population || 0));

  const nameSet = new Set<string>();

  matchingCities.forEach((c) => {
    if (c.name) nameSet.add(`${c.name}, ${c.countryName}`);
    if (c.toponymName && c.toponymName !== c.name)
      nameSet.add(`${c.toponymName}, ${c.countryName}`);
  });

  const cities = Array.from(nameSet);

  return NextResponse.json({ cities });
}
