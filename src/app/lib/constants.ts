export const MEINL_WEB_API =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://apidev.meinl.de/MeinlWebApi/api"
    : "https://api.meinl.loc/MeinlWebApi/api";
