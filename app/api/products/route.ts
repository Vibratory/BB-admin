import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      stock,
      tags,
      sizes,
      colors,
      price,
      hidden,
      colorVariants,
      solde,
      newprice,
      brand

    } = await req.json();

    if (!title || !description || !media || !category || !price || !stock) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      stock,
      tags,
      sizes,
      colors,
      price,
      hidden,
      colorVariants,
      solde,
      newprice,
      brand
    });

    if (collections?.length) {
      await Promise.all(
        collections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(
            collectionId,
            { $addToSet: { products: newProduct._id } } 
          )
        )
      );
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

