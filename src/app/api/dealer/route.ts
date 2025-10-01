import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(req: Request) {
  const data = await req.json();

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.set(
    "Authorization",
    "Basic " + btoa(process.env.USERNAME + ":" + process.env.API_KEY)
  );

  const res = await fetch(`${MEINL_WEB_API}/storefinder`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      locale: "de-DE",
      brands: [data.brands],
      campagne: data.campagne,
      radius: data.distance || 50,
      coordinates: {
        latitude: data.latitude,
        longitude: data.longitude,
        distance: 0.0,
      },
      type: data.type,
    }),
  });
  const item = await res.json();
  return Response.json(item);
}
