import { getCurrentUser } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

async function getTransactions(userId: string) {
  try {
    await dbConnect();
    
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Properly serialize the data for client components
    return transactions.map(transaction => ({
      _id: transaction._id.toString(),
      personName: transaction.personName,
      amount: transaction.amount,
      purpose: transaction.purpose,
      type: transaction.type,
      userId: transaction.userId.toString(), // Convert ObjectId to string
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to view your dashboard</h1>
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

  const transactions = await getTransactions(user.id);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <DashboardClient transactions={transactions} user={user} />
    </div>
  );
}