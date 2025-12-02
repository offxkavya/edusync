"use server";

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function authenticateRequest(req, options = {}) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    if (
      options.allowedRoles &&
      options.allowedRoles.length > 0 &&
      !options.allowedRoles.includes(user.role)
    ) {
      return { error: "Forbidden", status: 403 };
    }

    return { user };
  } catch (error) {
    return { error: "Invalid or expired token", status: 401 };
  }
}


