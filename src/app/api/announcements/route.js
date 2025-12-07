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

export async function PUT(req) {
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
    const { id, title, body: message, audience } = body;

    if (!id || !title || !message) {
      return NextResponse.json(
        { error: "ID, title, and body are required" },
        { status: 400 }
      );
    }

    // Check ownership if not admin
    const existing = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    if (user.role !== "ADMIN" && existing.authorId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this announcement" },
        { status: 403 }
      );
    }

    const announcement = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: {
        title,
        body: message,
        audience: audience || null,
      },
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("Update Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Check ownership if not admin
    const existing = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    if (user.role !== "ADMIN" && existing.authorId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this announcement" },
        { status: 403 }
      );
    }

    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Delete Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}


