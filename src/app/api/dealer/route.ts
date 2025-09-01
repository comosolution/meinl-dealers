export async function POST(req: Request) {
  const data = await req.json();

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.set(
    "Authorization",
    "Basic " + btoa(process.env.USERNAME + ":" + process.env.API_KEY)
  );

  const res = await fetch(
    "https://apidev.meinl.de/MeinlWebApi/api/storefinder",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        locale: "de-DE",
        brands: [...data.brands],
        radius: data.distance || 10,
        address: null,
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude,
          distance: 0.0,
        },
      }),
    }
  );
  const item = await res.json();
  return Response.json(item);
}
