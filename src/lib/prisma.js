import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  global.prisma = global.prisma || prisma;
}

export default process.env.NODE_ENV === "production" ? prisma : global.prisma || prisma;