import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

type ProfileRequestBody = {
  name?: unknown;
  phone?: unknown;
  image?: unknown;
  language?: unknown;
  currency?: unknown;
  theme?: unknown;
};

const allowedLanguages = new Set(["en", "es", "fr"]);
const allowedCurrencies = new Set(["USD"]);
const allowedThemes = new Set(["system", "light", "dark"]);

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be signed in to update your profile.",
        },
        {
          status: 401,
        }
      );
    }

    const userId = (session.user as { id?: string }).id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unable to identify the signed-in user.",
        },
        {
          status: 401,
        }
      );
    }

    const body = (await request.json()) as ProfileRequestBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const image =
      typeof body.image === "string" && body.image.trim()
        ? body.image.trim()
        : null;

    const language =
      typeof body.language === "string"
        ? body.language.trim().toLowerCase()
        : "en";

    // Fixes values such as "usd", "USD ", or "USD — US Dollar".
    const submittedCurrency =
      typeof body.currency === "string"
        ? body.currency.trim().toUpperCase()
        : "USD";

    const currency =
      submittedCurrency.startsWith("USD")
        ? "USD"
        : submittedCurrency;

    const theme =
      typeof body.theme === "string"
        ? body.theme.trim().toLowerCase()
        : "system";

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        {
          error: "Name must be between 2 and 80 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (phone && !/^[+()\-\s\d]{7,20}$/.test(phone)) {
      return NextResponse.json(
        {
          error: "Please enter a valid phone number.",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowedLanguages.has(language)) {
      return NextResponse.json(
        {
          error: "Invalid language selection.",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowedCurrencies.has(currency)) {
      return NextResponse.json(
        {
          error: "Invalid currency selection.",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowedThemes.has(theme)) {
      return NextResponse.json(
        {
          error: "Invalid theme selection.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      image &&
      !image.startsWith("https://") &&
      !image.startsWith("/") &&
      !image.startsWith("data:image/")
    ) {
      return NextResponse.json(
        {
          error: "Invalid profile image.",
        },
        {
          status: 400,
        }
      );
    }

    if (image?.startsWith("data:image/") && image.length > 2_800_000) {
      return NextResponse.json(
        {
          error: "Profile image is too large.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User account was not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phone: phone || null,
        image,
        language,
        currency,
        theme,
      },
    });

    return NextResponse.json({
      message: "Your profile was updated successfully.",
    });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);

    return NextResponse.json(
      {
        error: "Something went wrong while updating your profile.",
      },
      {
        status: 500,
      }
    );
  }
}