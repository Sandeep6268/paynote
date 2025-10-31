// app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
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

    // Find transaction and verify ownership
    const transaction = await Transaction.findOne({ 
      _id: id, 
      userId: session.user.id 
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Update transaction
    transaction.personName = personName.trim();
    transaction.amount = parsedAmount; // Integer amount use karein
    transaction.purpose = purpose?.trim() || "";
    transaction.type = type;

    await transaction.save();

    return NextResponse.json(
      { 
        message: "Transaction updated successfully", 
        transaction: {
          id: transaction._id.toString(),
          personName: transaction.personName,
          amount: transaction.amount,
          purpose: transaction.purpose,
          type: transaction.type,
          createdAt: transaction.createdAt,
        }
      }
    );
  } catch (error: any) {
    console.error("Transaction update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    // Find transaction and verify ownership
    const transaction = await Transaction.findOne({ 
      _id: id, 
      userId: session.user.id 
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Delete transaction
    await Transaction.deleteOne({ _id: id });

    return NextResponse.json(
      { message: "Transaction deleted successfully" }
    );
  } catch (error: any) {
    console.error("Transaction deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}