import { Suspense } from "react";
import { BRAND } from "@/lib/constants";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { AuthSessionProvider } from "@/components/admin/SessionProvider";

export const metadata = {
  title: `Login | ${BRAND.name} Admin`,
};

export default function AdminLoginPage() {
  return (
    <AuthSessionProvider>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">{BRAND.name}</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to the admin portal</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <Suspense fallback={<p className="text-center text-sm text-slate-500">Loading...</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
      <AdminToaster />
    </AuthSessionProvider>
  );
}
