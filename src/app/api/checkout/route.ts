import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please login to continue." }, { status: 401 });
    }

    const body = await req.json();
    const { modelId, services, paymentMethod, paymentScreenshotUrl, contactAddress, deliveryMethod } = body;

    if (!modelId || !services || services.length === 0 || !contactAddress) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // fetch services to calculate authentic price
    const selectedServices = await prisma.repairService.findMany({
      where: { id: { in: services } }
    });

    const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const booking = await prisma.booking.create({
      data: {
        customerId: (session.user as any).id,
        modelId,
        totalAmount,
        paymentMethod,
        paymentScreenshotUrl,
        paymentStatus: paymentMethod === "ONLINE" ? "PENDING" : "PENDING",
        bookingStatus: "pending approval",
        repairStatus: "PENDING",
        contactAddress,
        deliveryMethod,
        services: {
          create: selectedServices.map(s => ({
            repairServiceId: s.id,
            priceApplied: s.price
          }))
        }
      }
    });

    return NextResponse.json({ message: "Booking successful", bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
