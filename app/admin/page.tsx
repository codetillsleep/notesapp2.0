import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin Dashboard – 10GPA",
  description: "Admin panel for managing subjects, branches and semesters on 10GPA.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Not logged in → redirect to login
  if (!session?.user?.email) {
    redirect("/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  // Not admin → show unauthorized screen
  if (!adminEmail || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080b18]">
        <div className="text-center space-y-4 px-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400 text-sm max-w-sm">
            You don&apos;t have permission to access the admin dashboard. This area is restricted to administrators only.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return <AdminDashboard adminEmail={session.user.email} />;
}
