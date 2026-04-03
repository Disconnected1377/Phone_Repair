import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await (prisma as any).siteSettings.findUnique({
      where: { id: "global" }
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { paymentQRCodeUrl } = body;

    if (!paymentQRCodeUrl) {
      return NextResponse.json({ message: "No QR Code image provided." }, { status: 400 });
    }

    console.log("Updating SiteSettings with image length:", paymentQRCodeUrl.length);

    const settings = await (prisma as any).siteSettings.upsert({
      where: { id: "global" },
      update: { paymentQRCodeUrl },
      create: { id: "global", paymentQRCodeUrl }
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json({
      message: "Failed to update settings.",
      details: error.message
    }, { status: 500 });
  }
}
