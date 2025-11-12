import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(`${MEINL_WEB_API}/campaign/${id}`);

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "API request failed",
          status: res.status,
          text: res.text(),
        }),
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
