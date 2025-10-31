"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, LogOut, Plus, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

interface DashboardNavProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left Side */}
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="relative">
                <Wallet className="h-8 w-8 text-indigo-400" />
                <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-white">PayNote</span>
                <span className="block text-xs text-gray-400 -mt-1">Smart Digital Ledger</span>
              </div>
              <div className="sm:hidden">
                <span className="text-xl font-bold text-white">PayNote</span>
              </div>
            </Link>

            {/* Desktop Navigation - Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Add Note Button - ONLY IN DESKTOP */}
              <Button 
                asChild 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-300"
              >
                <Link href="/add-note" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Note</span>
                </Link>
              </Button>

              {/* User Info and Logout */}
              <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
                {/* User Avatar and Name */}
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border border-gray-600 bg-gray-800">
                    <AvatarFallback className="bg-indigo-900/50 text-indigo-300 font-semibold text-sm border border-indigo-700">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-300 max-w-24 truncate">
                    {user?.name}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-red-800 bg-red-900/20 text-red-300 hover:bg-red-800 hover:text-white hover:border-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button - REMOVED ADD NOTE BUTTON FROM HERE */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 animate-in slide-in-from-top duration-300 absolute top-16 left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                <Avatar className="h-10 w-10 border border-gray-600 bg-gray-800">
                  <AvatarFallback className="bg-indigo-900/50 text-indigo-300 font-semibold text-base border border-indigo-700">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-3">
                {/* Add Note Button - ONLY IN MOBILE MENU */}
                <Button 
                  asChild 
                  className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-300"
                >
                  <Link 
                    href="/add-note" 
                    className="flex items-center space-x-2"
                    onClick={closeMobileMenu}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Note</span>
                  </Link>
                </Button>

                <Button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="w-full justify-start border-red-800 bg-red-900/20 text-red-300 hover:bg-red-800 hover:text-white hover:border-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu - FIXED Z-INDEX */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}