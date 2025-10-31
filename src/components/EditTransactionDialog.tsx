"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

interface Transaction {
  _id: string;
  personName: string;
  amount: number;
  purpose: string;
  type: 'given' | 'received';
  createdAt: string;
}

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onUpdate
}: EditTransactionDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    personName: "",
    amount: "",
    purpose: "",
    type: "given" as "given" | "received"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setFormData({
        personName: transaction.personName,
        amount: transaction.amount.toString(),
        purpose: transaction.purpose,
        type: transaction.type
      });
    }
  }, [transaction]);

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
    if (!transaction) return;

    setLoading(true);
    setError("");

    // Validation
    if (!formData.personName.trim() || !formData.amount) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be greater than 0");
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
          amount: parseFloat(formData.amount),
          purpose: formData.purpose.trim(),
          type: formData.type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onUpdate();
        onClose();
        router.refresh();
      } else {
        setError(data.error || "Failed to update transaction");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    if (!confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onUpdate();
        onClose();
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete transaction");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Person Name */}
          <div className="space-y-2">
            <Label htmlFor="personName" className="text-gray-700 font-medium">
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
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 font-medium">
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
              step="0.01"
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-gray-700 font-medium">
              Purpose / Description
            </Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Enter purpose or description (optional)"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Transaction Type */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Transaction Type *</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeChange("given")}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  formData.type === "given"
                    ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm">Payment Given</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("received")}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  formData.type === "received"
                    ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm">Payment Received</span>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}