import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount === 0) {
      await prisma.user.create({
        data: {
          username: "admin",
          phoneNumber: "1234567890",
          passwordHash: await bcrypt.hash("admin123", 10),
          role: "ADMIN"
        }
      });
    }

    const brandCount = await prisma.brand.count();
    if (brandCount === 0) {
      const apple = await prisma.brand.create({ data: { name: "Apple" } });
      const motorola = await prisma.brand.create({ data: { name: "Motorola" } });
      
      const iphone13 = await prisma.model.create({ data: { name: "iPhone 13", brandId: apple.id } });
      const motoG45 = await prisma.model.create({ data: { name: "Moto G45", brandId: motorola.id } });

      await prisma.repairService.createMany({
        data: [
          { modelId: iphone13.id, type: "Screen Repair", description: "Replace broken screen", price: 5000, partPrice: 3000 },
          { modelId: iphone13.id, type: "Battery Repair", description: "Replace old battery", price: 3000, partPrice: 2000 },
          { modelId: motoG45.id, type: "Broken Screen Repair (Outer Glass)", description: "If outer glass is broken", price: 2299, partPrice: 1500 },
          { modelId: motoG45.id, type: "Charging Port Repair", description: "Unable to detect charging", price: 1999, partPrice: 800 },
        ]
      });
    }

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
