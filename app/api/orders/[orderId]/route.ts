import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product"; // <-- must be imported early to register
import Customer from "@/lib/models/Customer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    await connectToDB();


    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: "Product", // ✅ string, not imported class
    });

    if (!orderDetails) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 404 });
    }

    const customer = await Customer.findOne({
      clerkId: orderDetails.customerClerkId,
    });

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (err) {
    console.error("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
