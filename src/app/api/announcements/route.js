import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const audience = searchParams.get("audience");

  const announcements = await prisma.announcement.findMany({
    where: audience ? { audience } : undefined,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ data: announcements });
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
    const { title, body: message, audience } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body: message,
        audience: audience || null,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}


