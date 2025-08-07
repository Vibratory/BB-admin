import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Coll from "@/lib/models/Coll";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB()

    const { title } = await req.json()

    const existingColl = await Coll.findOne({ title })

    if (existingColl) {
      return new NextResponse("coll already exists", { status: 400 })
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const newColl = await Coll.create({
      title,
    })

    await newColl.save()

    return NextResponse.json(newColl, { status: 200 })
  } catch (err) {
    console.log("[colls_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const colls = await Coll.find().sort({ createdAt: "desc" })
    const response = NextResponse.json(colls, { status: 200 })

    response.headers.set("Access-Control-Allow-Origin", "*"); 
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response
  } catch (err) {
    console.log("[colls_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }, })
  }
}

export const dynamic = "force-dynamic";
