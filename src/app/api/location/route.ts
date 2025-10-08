import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const cfIp = req.headers.get("cf-connecting-ip");
    const ip = forwarded?.split(",")[0] || cfIp || "8.8.8.8";

    const token = process.env.IPINFO_TOKEN;
    const res = await fetch(
      `https://ipinfo.io/${ip}/json?token=${token || ""}`
    );
    const data = await res.json();

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (data.loc) {
      [latitude, longitude] = data.loc
        .split(",")
        .map((coord: string) => parseFloat(coord));
    }

    return NextResponse.json({
      ip: data.ip,
      country: data.country,
      city: data.city,
      region: data.region,
      latitude,
      longitude,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch location" },
      { status: 500 }
    );
  }
}
