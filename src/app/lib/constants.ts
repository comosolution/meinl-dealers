export const MEINL_WEB_API =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://meinlwebapidev.meinl.loc/api"
    : "https://meinlwebapi.meinl.loc/api";
