import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
  try{
    const {email,password} = req.body;

    const checkUser = await prisma.user.findUnique({where:{email}})

    if(!checkUser){
        return NextResponse.json({message:"User does not exist"}, {status: 400});
    }

    const passMatch = await bcrypt.compare(password, checkUser.password);
    if(passMatch){
        const token = jwt.sign(
            {userId: newUser.id, email: newUser.email,name:newUser.name},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        return NextResponse.json({token}, {status: 200});
    }

    return NextResponse.json({message:"Invalid credentials"}, {status: 401});
  }catch(err){
    return NextResponse.json({message:"Internal Server Error"}, {status: 500});
  }
}
