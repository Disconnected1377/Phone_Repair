import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { brandName, modelName, type, description, price, partPrice, estimatedTime } = await req.json();

    if (!brandName || !modelName || !type || !price) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Find or create Brand
    let brand = await prisma.brand.findUnique({
      where: { name: brandName.trim() }
    });
    
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: brandName.trim() }
      });
    }

    // 2. Find or create Model
    let model = await prisma.model.findFirst({
      where: { 
        name: modelName.trim(),
        brandId: brand.id 
      }
    });

    if (!model) {
      model = await prisma.model.create({
        data: { 
          name: modelName.trim(),
          brandId: brand.id
        }
      });
    }

    // 3. Create Repair Service
    const repairService = await prisma.repairService.create({
      data: {
        modelId: model.id,
        type: type.trim(),
        description: description?.trim() || "",
        price: parseFloat(price.toString()),
        partPrice: parseFloat((partPrice || 0).toString()),
        estimatedTime: estimatedTime?.trim() || null
      } as any
    });

    return NextResponse.json({ message: "Repair service added successfully", repairService }, { status: 201 });
  } catch (error) {
    console.error("ADD_REPAIR_ERROR:", error);
    return NextResponse.json({ 
      message: "Internal server error occurred while adding the repair service.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
