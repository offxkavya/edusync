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

  const { user } = authResult;
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId")
    ? Number(searchParams.get("courseId"))
    : undefined;
  const studentId = searchParams.get("studentId")
    ? Number(searchParams.get("studentId"))
    : user.role === "STUDENT"
    ? user.studentProfile?.id
    : undefined;

  const where = {};
  if (courseId) where.courseId = courseId;
  if (studentId) where.studentId = studentId;

  const marks = await prisma.mark.findMany({
    where,
    include: {
      course: true,
      student: {
        include: { user: true },
      },
      faculty: true,
    },
    orderBy: { recordedAt: "desc" },
  });

  return NextResponse.json({ data: marks });
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
    const { courseId, studentId, assessment, score, maxScore } = body;

    if (!courseId || !studentId || !assessment) {
      return NextResponse.json(
        { error: "courseId, studentId, and assessment are required" },
        { status: 400 }
      );
    }

    const mark = await prisma.mark.upsert({
      where: {
        studentId_courseId_assessment: {
          studentId,
          courseId,
          assessment,
        },
      },
      update: {
        score,
        maxScore,
        recordedBy: user.id,
        recordedAt: new Date(),
      },
      create: {
        studentId,
        courseId,
        assessment,
        score,
        maxScore,
        recordedBy: user.id,
      },
    });

    return NextResponse.json({ mark }, { status: 201 });
  } catch (error) {
    console.error("Mark Error:", error);
    return NextResponse.json(
      { error: "Failed to record marks" },
      { status: 500 }
    );
  }
}


