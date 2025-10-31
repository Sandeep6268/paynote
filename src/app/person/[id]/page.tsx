import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Calendar, User, Plus } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

async function getPersonTransactions(userId: string, personName: string) {
  try {
    await dbConnect();
    
    const transactions = await Transaction.find({ 
      userId, 
      personName: decodeURIComponent(personName) 
    })
    .sort({ createdAt: -1 })
    .lean();

    // Properly serialize the data
    return transactions.map(transaction => ({
      _id: transaction._id.toString(),
      personName: transaction.personName,
      amount: transaction.amount,
      purpose: transaction.purpose,
      type: transaction.type,
      createdAt: transaction.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching person transactions:', error);
    return [];
  }
}

function calculatePersonSummary(transactions: any[]) {
  let totalGiven = 0;
  let totalReceived = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'given') {
      totalGiven += transaction.amount;
    } else {
      totalReceived += transaction.amount;
    }
  });

  const netAmount = totalReceived - totalGiven;

  return {
    totalGiven,
    totalReceived,
    netAmount,
    transactionCount: transactions.length
  };
}

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to view this page</h1>
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

  const personName = decodeURIComponent(id);
  const transactions = await getPersonTransactions(user.id, personName);
  const { totalGiven, totalReceived, netAmount, transactionCount } = calculatePersonSummary(transactions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-700">
                <User className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{personName}</h1>
                <p className="text-gray-300">{transactionCount} transaction(s)</p>
              </div>
            </div>
          </div>
          
          <Button 
            asChild 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg"
          >
            <Link href="/add-note" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Given */}
          <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-200">Total Given</CardTitle>
              <div className="p-2 bg-red-900/30 rounded-full border border-red-800">
                <ArrowUpRight className="h-4 w-4 text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">₹{totalGiven.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Amount you gave</p>
            </CardContent>
          </Card>

          {/* Total Received */}
          <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-200">Total Received</CardTitle>
              <div className="p-2 bg-green-900/30 rounded-full border border-green-800">
                <ArrowDownRight className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">₹{totalReceived.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Amount you received</p>
            </CardContent>
          </Card>

          {/* Net Balance */}
          <Card className={`border shadow-xl backdrop-blur-sm ${
            netAmount >= 0 
              ? 'border-green-700 bg-green-900/20' 
              : 'border-red-700 bg-red-900/20'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-200">Net Balance</CardTitle>
              <div className={`p-2 rounded-full border ${
                netAmount >= 0 ? 'bg-green-900/30 border-green-800' : 'bg-red-900/30 border-red-800'
              }`}>
                <span className="text-sm">💰</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                netAmount >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {netAmount >= 0 ? '+' : ''}₹{Math.abs(netAmount).toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">
                {netAmount >= 0 ? `${personName} owes you` : `You owe ${personName}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <CardTitle className="text-white text-xl">Transaction History</CardTitle>
            <CardDescription className="text-gray-400">
              Complete history of payments with {personName}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Transactions Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Start by adding your first transaction with {personName}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          transaction.type === "given" 
                            ? "bg-red-900/30 border-red-800 text-red-400" 
                            : "bg-green-900/30 border-green-800 text-green-400"
                        }`}
                      >
                        {transaction.type === "given" ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          transaction.type === "given" ? "text-red-400" : "text-green-400"
                        }`}>
                          {transaction.type === "given" ? "Payment Given" : "Payment Received"}
                        </p>
                        <p className="text-sm text-gray-300">
                          {transaction.purpose || "No description"}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          transaction.type === "given" 
                            ? "text-red-400" 
                            : "text-green-400"
                        }`}
                      >
                        {transaction.type === "given" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}