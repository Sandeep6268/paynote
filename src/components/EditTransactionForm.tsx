"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, ArrowDownRight, Loader2, AlertTriangle, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Transaction {
  _id: string;
  personName: string;
  amount: number;
  purpose: string;
  type: 'given' | 'received';
}

interface EditTransactionFormProps {
  transaction: Transaction;
}

export default function EditTransactionForm({ transaction }: EditTransactionFormProps) {
  const [formData, setFormData] = useState({
    personName: transaction.personName,
    amount: transaction.amount.toString(),
    purpose: transaction.purpose,
    type: transaction.type
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    loading: false
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type: "given" | "received") => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.personName.trim() || !formData.amount) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Amount ko integer mein convert karein
    const parsedAmount = parseInt(formData.amount);

    if (parsedAmount <= 0 || isNaN(parsedAmount)) {
      setError("Amount must be a valid number greater than 0");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personName: formData.personName.trim(),
          amount: parsedAmount,
          purpose: formData.purpose.trim(),
          type: formData.type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update transaction");
      }

      // Success case
      toast.success('Transaction updated successfully!');
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
      
    } catch (error: any) {
      console.error("Update error:", error);
      setError(error.message || "Something went wrong");
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialog({
      isOpen: true,
      loading: false
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success('Transaction deleted successfully!');
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
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
        loading: false
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      loading: false
    });
  };

  // Delete Confirmation Dialog Component
  const DeleteConfirmationDialog = () => {
    if (!deleteDialog.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="bg-gray-800 border border-gray-700 shadow-2xl max-w-md w-full">
          <CardHeader className="bg-gradient-to-r from-red-900/20 to-gray-800 border-b border-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center border border-red-700">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <CardTitle className="text-white text-xl">
                  Delete Transaction?
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteCancel}
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                disabled={deleteDialog.loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-400">
              This action cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-gray-300 space-y-3">
              <p>
                Are you sure you want to delete this transaction?
              </p>
              <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                <p className="font-semibold text-white">{transaction.personName}</p>
                <p className={`text-sm font-medium ${transaction.type === 'given' ? 'text-red-400' : 'text-green-400'}`}>
                  {transaction.type === 'given' ? 'Payment Given' : 'Payment Received'} - ₹{transaction.amount.toLocaleString()}
                </p>
              </div>
              <p className="text-red-400 text-sm font-medium bg-red-900/20 border border-red-800 rounded-lg p-2">
                ⚠️ This will permanently remove the transaction from your records.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleDeleteCancel}
                disabled={deleteDialog.loading}
                className="flex-1 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={deleteDialog.loading}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 transition-all duration-300"
              >
                {deleteDialog.loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Card className="bg-gray-900 border border-gray-700 shadow-xl">
        <CardHeader className="bg-gray-800 border-b border-gray-700">
          <CardTitle className="text-white text-xl">Transaction Details</CardTitle>
          <CardDescription className="text-gray-400">
            Update the payment information below
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Person Name */}
            <div className="space-y-2">
              <Label htmlFor="personName" className="text-white font-medium">
                Person Name *
              </Label>
              <Input
                id="personName"
                name="personName"
                type="text"
                placeholder="Enter person's name"
                value={formData.personName}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white font-medium">
                Amount (₹) *
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                step="1"
                onInput={(e) => {
                  // Ensure only integers are entered
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                }}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-white font-medium">
                Purpose / Description
              </Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="Enter purpose or description (optional)"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400 resize-none"
              />
            </div>

            {/* Transaction Type */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Transaction Type *</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange("given")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.type === "given"
                      ? "border-red-500 bg-red-900/30 text-red-200 font-semibold"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === "given" ? "bg-red-800" : "bg-gray-700"
                    }`}>
                      <ArrowUpRight className="h-5 w-5 text-red-300" />
                    </div>
                    <span>Payment Given</span>
                    <span className="text-sm font-normal text-gray-400">You gave money</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("received")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.type === "received"
                      ? "border-green-500 bg-green-900/30 text-green-200 font-semibold"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === "received" ? "bg-green-800" : "bg-gray-700"
                    }`}>
                      <ArrowDownRight className="h-5 w-5 text-green-300" />
                    </div>
                    <span>Payment Received</span>
                    <span className="text-sm font-normal text-gray-400">You received money</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons - Updated with flex-wrap and center alignment for mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteClick}
                disabled={loading}
                className="w-full sm:flex-1 bg-red-900/50 text-red-200 border-red-700 hover:bg-red-800 hover:text-white hover:border-red-600 transition-all duration-300 order-2 sm:order-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Transaction
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="w-full sm:flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all duration-300 order-1 sm:order-2"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 transition-all duration-300 order-3"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Transaction"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog />
    </>
  );
}