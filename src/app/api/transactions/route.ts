import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { personName, amount, purpose, type } = await request.json();

    // Validation
    if (!personName || !amount || !type) {
      return NextResponse.json(
        { error: "Person name, amount, and type are required" },
        { status: 400 }
      );
    }

    // Amount ko integer mein convert karein
    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a valid number greater than 0" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await Transaction.create({
      personName: personName.trim(),
      amount: parsedAmount, // Integer amount use karein
      purpose: purpose?.trim() || "",
      type,
      userId: session.user.id,
    });

    return NextResponse.json(
      { 
        message: "Transaction created successfully", 
        transaction: {
          id: transaction._id.toString(),
          personName: transaction.personName,
          amount: transaction.amount,
          purpose: transaction.purpose,
          type: transaction.type,
          createdAt: transaction.createdAt,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}