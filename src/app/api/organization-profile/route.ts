import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { buildProducerOrganizationProfile } from "@/lib/producer-profile";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const organizationId =
      request.nextUrl.searchParams.get("organizationId") || "default";

    const profile = await buildProducerOrganizationProfile({ organizationId });

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error building organization profile:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to build organization profile",
      },
      { status: 500 }
    );
  }
}
