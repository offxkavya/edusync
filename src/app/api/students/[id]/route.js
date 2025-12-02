import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-server";

export async function GET(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;
  const studentId = Number(params.id);

  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student id" }, { status: 400 });
  }

  if (user.role === "STUDENT" && user.id !== studentId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      studentProfile: {
        include: {
          enrollments: {
            include: { course: true },
          },
          attendance: {
            include: { course: true, faculty: true },
            orderBy: { date: "desc" },
            take: 20,
          },
          marks: {
            include: { course: true, faculty: true },
            orderBy: { recordedAt: "desc" },
          },
        },
      },
    },
  });

  if (!student || student.role !== "STUDENT") {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({ student });
}

export async function PUT(req, { params }) {
  const authResult = await authenticateRequest(req, {
    allowedRoles: ["ADMIN", "FACULTY"],
  });
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const studentId = Number(params.id);
  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student id" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: studentId },
    include: { studentProfile: true },
  });

  if (!existing || existing.role !== "STUDENT") {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const body = await req.json();
  const {
    name,
    email,
    department,
    semester,
    guardianName,
    guardianPhone,
  } = body;

  const profileUpdate = {};
  if (department) profileUpdate.department = department;
  if (typeof semester === "number") profileUpdate.semester = semester;
  if (guardianName) profileUpdate.guardianName = guardianName;
  if (guardianPhone) profileUpdate.guardianPhone = guardianPhone;

  try {
    const updated = await prisma.user.update({
      where: { id: studentId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(Object.keys(profileUpdate).length > 0 && {
          studentProfile: {
            update: profileUpdate,
          },
        }),
      },
      include: {
        studentProfile: true,
      },
    });

    return NextResponse.json({ student: updated });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

