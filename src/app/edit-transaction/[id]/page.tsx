import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import EditTransactionForm from "@/components/EditTransactionForm";

async function getTransaction(transactionId: string, userId: string) {
  try {
    await dbConnect();
    
    const transaction = await Transaction.findOne({ 
      _id: transactionId, 
      userId 
    }).lean();

    if (!transaction) {
      return null;
    }

    // Properly serialize the data
    return {
      _id: transaction._id.toString(),
      personName: transaction.personName,
      amount: transaction.amount,
      purpose: transaction.purpose,
      type: transaction.type,
      userId: transaction.userId.toString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

interface EditTransactionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to edit transactions</h1>
          <a 
            href="/auth/login" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const transaction = await getTransaction(id, user.id);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Transaction not found</h1>
          <p className="text-gray-300 mb-6">
            The transaction you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-8">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700 transition-colors"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Transaction</h1>
            <p className="text-gray-300 mt-2">Update the payment details for <span className="text-indigo-300 font-medium">{transaction.personName}</span></p>
          </div>
        </div>

        <EditTransactionForm transaction={transaction} />
      </div>
    </div>
  );
}