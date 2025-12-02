import { NextResponse } from "next/server";
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

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
        facultyProfile: user.facultyProfile,
      },
    },
    { status: 200 }
  );
}

