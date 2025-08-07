import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { connectToDB } from "@/lib/mongoDB";
import Coll from "@/lib/models/Coll";
import Product from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { collId: string } }
) => {
  try {
    await connectToDB();

    const coll = await Coll.findById(params.collId).populate({ path: "products", model: Product });

    if (!coll) {
      return new NextResponse(
        JSON.stringify({ message: "Coll not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(coll, { status: 200 });
  } catch (err) {
    console.log("[collId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let coll = await Coll.findById(params.collId);

    if (!coll) {
      return new NextResponse("Coll not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    coll = await Coll.findByIdAndUpdate(
      params.collId,
      {
        $set: { title},
      },
      { new: true }
    );


    await coll.save();

    return NextResponse.json(coll, { status: 200 });
  } catch (err) {
    console.log("[collId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Coll.findByIdAndDelete(params.collId);

    await Product.updateMany(
      { colls: params.collId },
      { $pull: { colls: params.collId } }
    );

    return new NextResponse("Collis deleted", { status: 200 });
  } catch (err) {
    console.log("[collId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
