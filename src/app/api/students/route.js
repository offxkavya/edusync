import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-server";

export async function GET(req) {
  const authResult = await authenticateRequest(req, {
    allowedRoles: ["ADMIN", "FACULTY"],
  });

  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const department = searchParams.get("department") || undefined;
  const semester = searchParams.get("semester")
    ? Number(searchParams.get("semester"))
    : undefined;
  const search = searchParams.get("search") || "";

  const studentProfileFilter = {};
  if (department) studentProfileFilter.department = department;
  if (semester) studentProfileFilter.semester = semester;

  const whereClause = {
    role: "STUDENT",
  };

  if (Object.keys(studentProfileFilter).length > 0) {
    whereClause.studentProfile = {
      is: studentProfileFilter,
    };
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      {
        studentProfile: {
          is: {
            enrollmentNo: { contains: search, mode: "insensitive" },
          },
        },
      },
    ];
  }

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      include: {
        studentProfile: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    data: students,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req) {
  const authResult = await authenticateRequest(req, {
    allowedRoles: ["ADMIN"],
  });

  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      enrollmentNo,
      department,
      semester,
      guardianName,
      guardianPhone,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!enrollmentNo || !department || typeof semester !== "number") {
      return NextResponse.json(
        {
          error: "Enrollment number, department, and semester are required",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        studentProfile: {
          create: {
            enrollmentNo,
            department,
            semester,
            guardianName,
            guardianPhone,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create Student Error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}


