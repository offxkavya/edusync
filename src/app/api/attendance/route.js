import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-server";

export async function GET(req) {
  const authResult = await authenticateRequest(req);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId")
    ? Number(searchParams.get("courseId"))
    : undefined;
  const studentId = searchParams.get("studentId")
    ? Number(searchParams.get("studentId"))
    : undefined;

  const where = {};
  if (courseId) where.courseId = courseId;
  
  // If student, only show their own attendance
  if (authResult.user.role === "STUDENT" && authResult.user.studentProfile) {
    where.studentId = authResult.user.studentProfile.id;
  } else if (studentId) {
    where.studentId = studentId;
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      course: true,
      student: {
        include: { user: true },
      },
      faculty: true,
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ data: attendance });
}

export async function POST(req) {
  const authResult = await authenticateRequest(req, {
    allowedRoles: ["ADMIN", "FACULTY"],
  });

  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  try {
    const body = await req.json();
    const { courseId, date, records } = body;

    if (!courseId || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "courseId and records array are required" },
        { status: 400 }
      );
    }

    const createData = records.map((record) => ({
      courseId,
      studentId: record.studentId,
      status: record.status || "PRESENT",
      remarks: record.remarks,
      date: date ? new Date(date) : new Date(),
      recordedBy: user.id,
    }));

    await prisma.attendance.createMany({
      data: createData,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Attendance recorded" }, { status: 201 });
  } catch (error) {
    console.error("Attendance Error:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    );
  }
}


