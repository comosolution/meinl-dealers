export async function POST() {
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
        kdnr: null,
        vanr: 0,
      }),
    }
  );
  const item = await res.json();
  return Response.json(item);
}
