"use client";

import { useState, useMemo } from "react";
import DashboardSummary from "@/components/DashboardSummary";
import TransactionList from "@/components/TransactionList";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";

function calculateTotals(transactions: any[]) {
  let totalToReceive = 0;
  let totalToGive = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'received') {
      totalToReceive += transaction.amount;
    } else if (transaction.type === 'given') {
      totalToGive += transaction.amount;
    }
  });

  const netBalance = totalToReceive - totalToGive;

  return {
    totalToReceive,
    totalToGive,
    netBalance
  };
}

interface DashboardClientProps {
  transactions: any[];
  user: any;
}

export default function DashboardClient({ transactions, user }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    
    return transactions.filter(transaction =>
      transaction.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.purpose && transaction.purpose.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [transactions, searchQuery]);

  const { totalToReceive, totalToGive, netBalance } = calculateTotals(transactions);

  return (
    <div className="space-y-8 p-6">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Here&apos;s your financial overview and recent transactions.
          </p>
        </div>
        
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search people or purposes..."
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Receive */}
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-sm border border-green-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-green-100">To Receive</CardTitle>
            <div className="p-2 bg-green-800/50 rounded-full border border-green-600">
              <TrendingDown className="h-5 w-5 text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-300 mb-2">₹{totalToReceive.toLocaleString()}</div>
            <p className="text-sm text-green-200/80">
              People owe you money
            </p>
          </CardContent>
        </Card>

        {/* To Give */}
        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-red-100">To Give</CardTitle>
            <div className="p-2 bg-red-800/50 rounded-full border border-red-600">
              <TrendingUp className="h-5 w-5 text-red-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-300 mb-2">₹{totalToGive.toLocaleString()}</div>
            <p className="text-sm text-red-200/80">
              You owe to people
            </p>
          </CardContent>
        </Card>

        {/* Total Balance */}
        <Card className={`backdrop-blur-sm border shadow-xl hover:shadow-2xl transition-all duration-300 ${
          netBalance >= 0 
            ? 'bg-gradient-to-br from-blue-900/50 to-indigo-800/50 border-blue-700' 
            : 'bg-gradient-to-br from-orange-900/50 to-amber-800/50 border-orange-700'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className={`text-lg font-semibold ${
              netBalance >= 0 ? 'text-blue-100' : 'text-orange-100'
            }`}>
              Net Balance
            </CardTitle>
            <div className={`p-2 rounded-full border ${
              netBalance >= 0 ? 'bg-blue-800/50 border-blue-600' : 'bg-orange-800/50 border-orange-600'
            }`}>
              <span className="text-lg">💰</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${
              netBalance >= 0 ? 'text-blue-300' : 'text-orange-300'
            }`}>
              {netBalance >= 0 ? '+' : ''}₹{Math.abs(netBalance).toLocaleString()}
            </div>
            <p className={`text-sm ${
              netBalance >= 0 ? 'text-blue-200/80' : 'text-orange-200/80'
            }`}>
              {netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Summary with filtered transactions */}
      <DashboardSummary transactions={filteredTransactions} />

      {/* Recent Transactions with filtered transactions */}
      <TransactionList transactions={filteredTransactions.slice(0, 10)} />
    </div>
  );
}