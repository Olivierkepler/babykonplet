const squareEnv = process.env.SQUARE_ENV || "sandbox";

export const squareBaseUrl =
  squareEnv === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

export const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
export const squareLocationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
export const squareVersion = "2026-03-18";