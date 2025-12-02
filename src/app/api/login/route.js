import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const checkUser = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    if (!checkUser) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    const passMatch = await bcrypt.compare(password, checkUser.password);
    if (passMatch) {
      const token = jwt.sign(
        {
          userId: checkUser.id,
          email: checkUser.email,
          name: checkUser.name,
          role: checkUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json(
        {
          token,
          user: {
            id: checkUser.id,
            name: checkUser.name,
            email: checkUser.email,
            role: checkUser.role,
            studentProfile: checkUser.studentProfile,
            facultyProfile: checkUser.facultyProfile,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
