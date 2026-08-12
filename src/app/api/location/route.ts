import { NextRequest, NextResponse } from "next/server";

type NominatimAddress = {
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  "ISO3166-2-lvl4"?: string;
};

type NominatimResult = {
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: NominatimAddress;
};

function uniqueParts(parts: Array<string | undefined>) {
  return Array.from(new Set(parts.filter(Boolean))) as string[];
}

function getArea(address?: NominatimAddress) {
  return (
    address?.suburb ||
    address?.neighbourhood ||
    address?.city_district ||
    ""
  );
}

function getCity(address?: NominatimAddress) {
  return (
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.county ||
    ""
  );
}

function createLocationLabel(address?: NominatimAddress) {
  if (!address) return "";

  return uniqueParts([
    getArea(address),
    getCity(address),
    address.state,
    address.postcode,
  ]).join(", ");
}

function isMassachusetts(address?: NominatimAddress) {
  const state = address?.state?.trim().toLowerCase() || "";
  const stateCode =
    address?.["ISO3166-2-lvl4"]?.trim().toUpperCase() || "";
  const postcode = address?.postcode?.trim() || "";

  // State/state-code are the source of truth. The ZIP ranges are only
  // a fallback for providers that omit state metadata.
  const massachusettsZip =
    /^(?:01\d{3}|02[0-7]\d{2})$/.test(postcode.slice(0, 5));

  return (
    state === "massachusetts" ||
    stateCode === "US-MA" ||
    (!state && !stateCode && massachusettsZip)
  );
}

function toLocationResult(
  result: NominatimResult,
  fallback: {
    postcode?: string;
    latitude?: string;
    longitude?: string;
  } = {},
) {
  const address = result.address;

  return {
    label:
      createLocationLabel(address) ||
      result.display_name ||
      fallback.postcode ||
      "Selected location",
    deliverable: isMassachusetts(address),
    serviceArea: "Massachusetts",
    area: getArea(address),
    city: getCity(address),
    state: address?.state || "",
    postcode: address?.postcode || fallback.postcode || "",
    country: address?.country || "",
    latitude: result.lat || fallback.latitude || "",
    longitude: result.lon || fallback.longitude || "",
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const zip = searchParams.get("zip")?.trim();
    const latitude = searchParams.get("lat")?.trim();
    const longitude = searchParams.get("lon")?.trim();

    let url: URL;
    let mode: "zip" | "coordinates";

    if (zip) {
      if (!/^\d{5}(?:-\d{4})?$/.test(zip)) {
        return NextResponse.json(
          { error: "Enter a valid 5-digit ZIP code." },
          { status: 400 },
        );
      }

      mode = "zip";
      url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("postalcode", zip);
      url.searchParams.set("countrycodes", "us");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("limit", "1");
    } else if (latitude && longitude) {
      const lat = Number(latitude);
      const lon = Number(longitude);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {
        return NextResponse.json(
          { error: "Invalid coordinates." },
          { status: 400 },
        );
      }

      mode = "coordinates";
      url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("lat", latitude);
      url.searchParams.set("lon", longitude);
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("zoom", "18");
    } else {
      return NextResponse.json(
        { error: "Provide a ZIP code or coordinates." },
        { status: 400 },
      );
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "DJADOR-Family-Store/1.0 (contact: venutanneru07@gmail.com)",
      },
      next:
        mode === "zip"
          ? {
              revalidate: 86400,
            }
          : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `Location provider returned status ${response.status}.`,
      );
    }

    if (mode === "zip") {
      const results = (await response.json()) as NominatimResult[];
      const result = results[0];

      if (!result) {
        return NextResponse.json(
          { error: "We could not find that ZIP code." },
          { status: 404 },
        );
      }

      return NextResponse.json(
        toLocationResult(result, {
          postcode: zip,
        }),
      );
    }

    const result = (await response.json()) as NominatimResult;

    if (!result?.address) {
      return NextResponse.json(
        { error: "We could not determine your address." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      toLocationResult(result, {
        latitude,
        longitude,
      }),
    );
  } catch (error) {
    console.error("Location lookup failed:", error);

    return NextResponse.json(
      {
        error:
          "We could not retrieve the location right now. Please try again.",
      },
      { status: 500 },
    );
  }
}