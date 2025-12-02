import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ALLOWED_ROLES = ["ADMIN", "FACULTY", "STUDENT"];

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role = "STUDENT",
      studentProfile,
      facultyProfile,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "STUDENT") {
      if (
        !studentProfile?.enrollmentNo ||
        !studentProfile?.department ||
        typeof studentProfile?.semester !== "number"
      ) {
        return NextResponse.json(
          {
            error:
              "Student profile requires enrollmentNo, department, and semester",
          },
          { status: 400 }
        );
      }

      userData.studentProfile = {
        create: {
          enrollmentNo: studentProfile.enrollmentNo,
          department: studentProfile.department,
          semester: studentProfile.semester,
          guardianName: studentProfile.guardianName,
          guardianPhone: studentProfile.guardianPhone,
        },
      };
    }

    if (role === "FACULTY") {
      if (
        !facultyProfile?.employeeCode ||
        !facultyProfile?.department
      ) {
        return NextResponse.json(
          { error: "Faculty profile requires employeeCode and department" },
          { status: 400 }
        );
      }

      userData.facultyProfile = {
        create: {
          employeeCode: facultyProfile.employeeCode,
          department: facultyProfile.department,
          specialization: facultyProfile.specialization,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          studentProfile: newUser.studentProfile,
          facultyProfile: newUser.facultyProfile,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
