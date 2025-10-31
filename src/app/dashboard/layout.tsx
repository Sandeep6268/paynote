import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <DashboardNav user={user} />
      <main className="container mx-auto px-2 py-2 sm:px-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}