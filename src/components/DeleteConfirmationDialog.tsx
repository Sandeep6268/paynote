"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import toast from "react-hot-toast";

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

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    transaction: Transaction | null;
    loading: boolean;
  }>({
    isOpen: false,
    transaction: null,
    loading: false
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = (transaction: Transaction) => {
    window.location.href = `/edit-transaction/${transaction._id}`;
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setDeleteDialog({
      isOpen: true,
      transaction,
      loading: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.transaction) return;

    setDeleteDialog(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/transactions/${deleteDialog.transaction._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success('Transaction deleted successfully!');
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete transaction");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeleteDialog({
        isOpen: false,
        transaction: null,
        loading: false
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      transaction: null,
      loading: false
    });
  };

  return (
    <>
      <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <CardTitle className="text-white text-xl">Recent Transactions</CardTitle>
          <CardDescription className="text-gray-400">
            Your latest payment notes and records
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Transactions Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                Start by adding your first payment note using the &quot;Add Note&quot; button above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-300 group backdrop-blur-sm gap-3"
                >
                  {/* Transaction Info */}
                  <Link
                    href={`/person/${encodeURIComponent(transaction.personName)}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border ${
                          transaction.type === "given" 
                            ? "bg-red-900/30 border-red-800 text-red-400" 
                            : "bg-green-900/30 border-green-800 text-green-400"
                        }`}
                      >
                        {transaction.type === "given" ? (
                          <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm sm:text-base truncate ${
                          transaction.type === "given" ? "text-red-400" : "text-green-400"
                        }`}>
                          {transaction.personName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 truncate">
                          {transaction.purpose || "No description"}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1 sm:hidden">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Amount and Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                    {/* Amount */}
                    <div className="text-right sm:text-left">
                      <p
                        className={`font-bold text-base sm:text-lg ${
                          transaction.type === "given" 
                            ? "text-red-400" 
                            : "text-green-400"
                        }`}
                      >
                        {transaction.type === "given" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
                      </p>
                      <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500 justify-end mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30 border border-transparent hover:border-indigo-700 transition-all duration-300 flex-shrink-0"
                        title="Edit transaction"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(transaction)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/30 border border-transparent hover:border-red-700 transition-all duration-300 flex-shrink-0"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        transactionName={deleteDialog.transaction?.personName || ""}
        amount={deleteDialog.transaction?.amount || 0}
        type={deleteDialog.transaction?.type || "given"}
        loading={deleteDialog.loading}
      />
    </>
  );
}