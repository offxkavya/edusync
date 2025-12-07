import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-server";

export async function GET(req) {
    try {
        const auth = await authenticateRequest(req, {
            allowedRoles: ["ADMIN"],
        });
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const faculty = await prisma.facultyProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
        });

        return NextResponse.json({ data: faculty });
    } catch (error) {
        console.error("Faculty API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
