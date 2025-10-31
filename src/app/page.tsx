import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownRight, Shield, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
              <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-400 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">PayNote</span>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700 text-xs sm:text-base"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-lg text-xs sm:text-base"
              asChild
            >
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Smart Digital Ledger</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Track Your Money 
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Flow</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            What you give and what you get - all in one place. 
            Simplify your financial tracking with smart notes and real-time insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl px-8 py-3 text-lg"
              asChild
            >
              <Link href="/auth/register">
                Start Tracking Now
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 px-8 py-3 text-lg"
              asChild
            >
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 bg-gray-800/30 backdrop-blur-sm shadow-xl hover:bg-gray-800/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Payment Given</CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-left">
                Track all money you&apos;ve given to others with detailed notes and purposes. Never forget a payment again.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 bg-gray-800/30 backdrop-blur-sm shadow-xl hover:bg-gray-800/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Payment Received</CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-left">
                Keep record of all money you&apos;re supposed to receive with smart reminders and due dates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 bg-gray-800/30 backdrop-blur-sm shadow-xl hover:bg-gray-800/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle className="text-white">Secure & Private</CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-left">
                Your financial data is encrypted and secure. Only you can access your personal information.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="border-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm shadow-2xl max-w-2xl mx-auto">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Simplify Your Finances?
            </h2>
            <p className="text-gray-300 mb-6">
              Join thousands of users who trust PayNote for their financial tracking needs.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
              asChild
            >
              <Link href="/auth/register">
                Get Started Free
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-gray-800">
        <p className="text-gray-500">
          © 2025 PayNote. All rights reserved. 
        </p>
      </footer>
    </div>
  );
}