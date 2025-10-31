"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Transaction {
  _id: string;
  personName: string;
  amount: number;
  purpose: string;
  type: 'given' | 'received';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Calculate person summaries
  const personSummaries = transactions.reduce((acc, transaction) => {
    const { personName, amount, type } = transaction;
    
    if (!acc[personName]) {
      acc[personName] = {
        name: personName,
        totalGiven: 0,
        totalReceived: 0,
        count: 0
      };
    }
    
    if (type === 'given') {
      acc[personName].totalGiven += amount;
    } else {
      acc[personName].totalReceived += amount;
    }
    
    acc[personName].count += 1;
    
    return acc;
  }, {} as Record<string, { name: string; totalGiven: number; totalReceived: number; count: number }>);

  const people = Object.values(personSummaries);

  const toReceive = people.filter(person => person.totalReceived > person.totalGiven)
    .map(person => ({
      name: person.name,
      amount: person.totalReceived - person.totalGiven,
      count: person.count
    }));

  const toGive = people.filter(person => person.totalGiven > person.totalReceived)
    .map(person => ({
      name: person.name,
      amount: person.totalGiven - person.totalReceived,
      count: person.count
    }));

  // Get heading color based on active tab
  const getHeadingColor = () => {
    switch (activeTab) {
      case "receive":
        return "text-green-300";
      case "give":
        return "text-red-300";
      case "all":
      default:
        return "text-indigo-300";
    }
  };

  // Get heading text based on active tab
  const getHeadingText = () => {
    switch (activeTab) {
      case "receive":
        return "Receivables Overview";
      case "give":
        return "Payables Overview";
      case "all":
      default:
        return "People Overview";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${getHeadingColor()}`}>
          {getHeadingText()}
        </h2>
        <span className="text-xs sm:text-sm text-gray-300 bg-gray-700 px-2 sm:px-3 py-1 rounded-full border border-gray-600">
          {people.length} {window.innerWidth < 640 ? 'ppl' : 'people'}
        </span>
      </div>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 rounded-lg h-10 sm:h-12 border border-gray-700">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-white rounded-md transition-all text-indigo-500 text-xs sm:text-sm"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="receive"
            className="data-[state=active]:bg-green-900/30 data-[state=active]:shadow-sm data-[state=active]:text-green-300 rounded-md transition-all text-green-500 text-xs sm:text-sm"
          >
            To Receive
          </TabsTrigger>
          <TabsTrigger 
            value="give"
            className="data-[state=active]:bg-red-900/30 data-[state=active]:shadow-sm data-[state=active]:text-red-300 rounded-md transition-all text-red-500 text-xs sm:text-sm"
          >
            To Give
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* To Receive Section */}
            <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-900/30 to-gray-800/50 border-b border-green-800 p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-green-300 text-lg sm:text-xl">
                  <div className="p-1 sm:p-2 bg-green-900/50 rounded-lg border border-green-700">
                    <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base">People Owe You</span>
                    <CardDescription className="text-green-400 mt-1 text-xs sm:text-sm">
                      Money you need to receive
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1 sm:p-6">
                {toReceive.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-green-700">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">No pending receipts</p>
                    <p className="text-gray-500 text-xs mt-1">All clear! Nobody owes you money.</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-4">
                    {toReceive.map((person, index) => (
                      <Link 
                        key={index}
                        href={`/person/${encodeURIComponent(person.name)}`}
                        className="block"
                      >
                        <div className="flex justify-between items-center p-2 sm:p-4 bg-green-900/20 rounded-lg border border-green-800 hover:bg-green-900/30 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-900/30 rounded-full flex items-center justify-center border border-green-700">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white text-sm sm:text-base truncate">{person.name}</p>
                              <p className="text-xs text-green-400">{person.count} transaction(s)</p>
                            </div>
                          </div>
                          <p className="font-bold text-green-300 text-sm sm:text-lg ml-2">₹{person.amount.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* To Give Section */}
            <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-900/30 to-gray-800/50 border-b border-red-800 p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-red-300 text-lg sm:text-xl">
                  <div className="p-1 sm:p-2 bg-red-900/50 rounded-lg border border-red-700">
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base">You Owe To</span>
                    <CardDescription className="text-red-400 mt-1 text-xs sm:text-sm">
                      Money you need to give
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1 sm:p-6">
                {toGive.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-red-700">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">No pending payments</p>
                    <p className="text-gray-500 text-xs mt-1">Great! You don't owe anyone.</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-4">
                    {toGive.map((person, index) => (
                      <Link 
                        key={index}
                        href={`/person/${encodeURIComponent(person.name)}`}
                        className="block"
                      >
                        <div className="flex justify-between items-center p-2 sm:p-4 bg-red-900/20 rounded-lg border border-red-800 hover:bg-red-900/30 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-900/30 rounded-full flex items-center justify-center border border-red-700">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white text-sm sm:text-base truncate">{person.name}</p>
                              <p className="text-xs text-red-400">{person.count} transaction(s)</p>
                            </div>
                          </div>
                          <p className="font-bold text-red-300 text-sm sm:text-lg ml-2">₹{person.amount.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="receive" className="mt-4 sm:mt-6">
          <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-900/30 to-gray-800/50 border-b border-green-800 p-4 sm:p-6">
              <CardTitle className="text-green-300 text-lg sm:text-xl">All Receivables</CardTitle>
              <CardDescription className="text-green-400 text-xs sm:text-sm">
                Complete list of people who owe you money
              </CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-6">
              {toReceive.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-green-700">
                    <ArrowDownRight className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No Receivables Yet</h3>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
                    When people owe you money, they'll appear here. Start by adding a "Payment To Receive" note.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  {toReceive.map((person, index) => (
                    <Link 
                      key={index}
                      href={`/person/${encodeURIComponent(person.name)}`}
                      className="block"
                    >
                      <div className="flex justify-between items-center p-2 sm:p-4 bg-green-900/20 rounded-lg border border-green-800 hover:bg-green-900/30 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-900/30 rounded-full flex items-center justify-center border border-green-700">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white text-sm sm:text-base truncate">{person.name}</p>
                            <p className="text-xs text-green-400">{person.count} transaction(s)</p>
                          </div>
                        </div>
                        <p className="font-bold text-green-300 text-sm sm:text-lg ml-2">₹{person.amount.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="give" className="mt-4 sm:mt-6">
          <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-900/30 to-gray-800/50 border-b border-red-800 p-4 sm:p-6">
              <CardTitle className="text-red-300 text-lg sm:text-xl">All Payables</CardTitle>
              <CardDescription className="text-red-400 text-xs sm:text-sm">
                Complete list of people you owe money to
              </CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-6">
              {toGive.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-red-700">
                    <ArrowUpRight className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No Payables Yet</h3>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
                    When you owe money to someone, they'll appear here. Start by adding a "Payment Given" note.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  {toGive.map((person, index) => (
                    <Link 
                      key={index}
                      href={`/person/${encodeURIComponent(person.name)}`}
                      className="block"
                    >
                      <div className="flex justify-between items-center p-2 sm:p-4 bg-red-900/20 rounded-lg border border-red-800 hover:bg-red-900/30 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-900/30 rounded-full flex items-center justify-center border border-red-700">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white text-sm sm:text-base truncate">{person.name}</p>
                            <p className="text-xs text-red-400">{person.count} transaction(s)</p>
                          </div>
                        </div>
                        <p className="font-bold text-red-300 text-sm sm:text-lg ml-2">₹{person.amount.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}