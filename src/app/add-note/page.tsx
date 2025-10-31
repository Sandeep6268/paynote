"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AddNotePage() {
  const [formData, setFormData] = useState({
    personName: "",
    amount: "",
    purpose: "",
    type: "given" as "given" | "received"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // Amount ko properly parse karein - integer mein convert karein
  const parsedAmount = parseInt(formData.amount);

  if (parsedAmount <= 0 || isNaN(parsedAmount)) {
    setError("Amount must be a valid number greater than 0");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personName: formData.personName.trim(),
        amount: parsedAmount, // Integer amount bhejein
        purpose: formData.purpose.trim(),
        type: formData.type,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Transaction added successfully!');
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      const errorMsg = data.error || "Failed to add transaction";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  } catch (error) {
    const errorMsg = "Something went wrong";
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};

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
            <h1 className="text-3xl font-bold text-white">Add Payment Note</h1>
            <p className="text-gray-300 mt-2">Record a new payment given or received</p>
          </div>
        </div>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <CardTitle className="text-white text-xl flex items-center space-x-2">
              <Plus className="h-5 w-5 text-indigo-400" />
              <span>New Transaction</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the payment information below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Person Name */}
              <div className="space-y-2">
                <Label htmlFor="personName" className="text-white font-medium flex items-center space-x-1">
                  <span>Person Name</span>
                  <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="personName"
                  name="personName"
                  type="text"
                  placeholder="Enter person's name (e.g., Ramesh Kumar)"
                  value={formData.personName}
                  onChange={handleChange}
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400 transition-colors"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white font-medium flex items-center space-x-1">
                  <span>Amount (₹)</span>
                  <span className="text-red-400">*</span>
                </Label>
                <Input
  id="amount"
  name="amount"
  type="number"
  placeholder="Enter amount (e.g., 5000)"
  value={formData.amount}
  onChange={handleChange}
  required
  min="1"
  step="1"
  onInput={(e) => {
    // Ensure only integers are entered
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
  }}
  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400 transition-colors"
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
                  placeholder="Enter purpose or description (optional) - e.g., Lunch payment, Rent, Loan, etc."
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={3}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400 resize-none transition-colors"
                />
              </div>

              {/* Transaction Type */}
              <div className="space-y-3">
                <Label className="text-white font-medium flex items-center space-x-1">
                  <span>Transaction Type</span>
                  <span className="text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("given")}
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-300 group ${
                      formData.type === "given"
                        ? "border-red-500 bg-red-900/30 text-red-200 font-semibold shadow-lg scale-105"
                        : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50 hover:scale-102"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        formData.type === "given" 
                          ? "bg-red-800 shadow-lg" 
                          : "bg-gray-600 group-hover:bg-gray-500"
                      }`}>
                        <ArrowUpRight className={`h-6 w-6 ${
                          formData.type === "given" ? "text-red-300" : "text-gray-400 group-hover:text-gray-300"
                        }`} />
                      </div>
                      <span className="font-medium">Payment Given</span>
                      <span className="text-sm font-normal text-gray-400">You gave money</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("received")}
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-300 group ${
                      formData.type === "received"
                        ? "border-green-500 bg-green-900/30 text-green-200 font-semibold shadow-lg scale-105"
                        : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50 hover:scale-102"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        formData.type === "received" 
                          ? "bg-green-800 shadow-lg" 
                          : "bg-gray-600 group-hover:bg-gray-500"
                      }`}>
                        <ArrowDownRight className={`h-6 w-6 ${
                          formData.type === "received" ? "text-green-300" : "text-gray-400 group-hover:text-gray-300"
                        }`} />
                      </div>
                      <span className="font-medium">Payment Received</span>
                      <span className="text-sm font-normal text-gray-400">You received money</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding Transaction...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Transaction</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}