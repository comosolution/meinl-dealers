export const MEINL_WEB_API =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? "https://api.meinl.loc/MeinlWebApi/api"
    : "https://apidev.meinl.de/MeinlWebApi/api";
