import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-server";

export async function GET(req) {
  try {
    const auth = await authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    // If student, only show enrolled courses
    if (auth.user.role === "STUDENT" && auth.user.studentProfile) {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: auth.user.studentProfile.id },
        select: { courseId: true },
      });
      where.id = { in: enrollments.map((e) => e.courseId) };
    }

    // If faculty, only show assigned courses
    if (auth.user.role === "FACULTY" && auth.user.facultyProfile) {
      const facultyCourses = await prisma.course.findMany({
        where: { facultyProfileId: auth.user.facultyProfile.id },
        select: { id: true },
      });
      where.id = { in: facultyCourses.map((c) => c.id) };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          faculty: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          enrollments: {
            include: {
              student: {
                include: {
                  user: {
                    select: { name: true, email: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Courses Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const auth = await authenticateRequest(req, {
      allowedRoles: ["ADMIN"],
    });
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { title, code, description, credits, facultyId } = body;

    if (!title || !code || !facultyId) {
      return NextResponse.json(
        { error: "Title, code, and faculty are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        code,
        department: "General", // Default or add to input
        credits: credits ? parseInt(credits) : 3,
        facultyProfileId: parseInt(facultyId),
        semester: 1, // Default or add to input
      },
      include: {
        faculty: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: course }, { status: 201 });
  } catch (error) {
    console.error("Create Course Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const auth = await authenticateRequest(req, {
      allowedRoles: ["ADMIN"],
    });
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { id, title, code, credits, facultyId } = body;

    if (!id || !title || !code || !facultyId) {
      return NextResponse.json(
        { error: "ID, title, code, and faculty are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        code,
        credits: credits ? parseInt(credits) : 3,
        facultyProfileId: parseInt(facultyId),
      },
      include: {
        faculty: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: course });
  } catch (error) {
    console.error("Update Course Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const auth = await authenticateRequest(req, {
      allowedRoles: ["ADMIN"],
    });
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

