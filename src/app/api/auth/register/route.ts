import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, phoneNumber, password } = await req.json();

    if (!username || !phoneNumber || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this username or phone number already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        phoneNumber,
        passwordHash,
      },
    });

    return NextResponse.json({ message: "User created successfully", user: { id: user.id, username: user.username } }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
