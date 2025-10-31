import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PayNote - Smart Digital Ledger",
  description: "Track your money flow – what you give and what you get.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#111827',
              color: 'white',
              border: '1px solid #374151',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: '1px solid #065f46',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#059669',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                border: '1px solid #991b1b',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#dc2626',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                border: '1px solid #3730a3',
                color: 'white',
              },
            },
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}