import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!process.env.API_USER || !process.env.API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Server configuration error: missing credentials",
        }),
        { status: 500 }
      );
    }

    const auth = Buffer.from(
      `${process.env.API_USER}:${process.env.API_KEY}`
    ).toString("base64");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic " + auth,
    };

    const response = await fetch(`${MEINL_WEB_API}/storefinder`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locale: "de-DE",
        brands: [data.brands],
        campagne: 0,
        salt: data.campagne,
        radius: data.distance || 50,
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude,
          distance: 0.0,
        },
        type: data.type,
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "API request failed",
          status: response.status,
        }),
        { status: response.status }
      );
    }

    let stores;
    try {
      stores = await response.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse API response JSON" }),
        { status: 500 }
      );
    }

    return Response.json(stores);
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
