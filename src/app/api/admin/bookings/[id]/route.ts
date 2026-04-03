import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Explicitly destructure what we expect to allow updates for
    const { bookingStatus, repairStatus, paymentStatus } = body;

    const dataToUpdate: any = {};
    if (bookingStatus) dataToUpdate.bookingStatus = bookingStatus;
    if (repairStatus) dataToUpdate.repairStatus = repairStatus;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: "No valid fields provided for update." }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ message: "Booking updated successfully", booking: updatedBooking });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
