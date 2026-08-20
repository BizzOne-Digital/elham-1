import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, type AuthUser } from "@/lib/auth/config";
import { USER_ROLES, type UserRole } from "@/lib/constants";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user?.email) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? "User",
    role: session.user.role ?? USER_ROLES.admin,
  };
}

export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  if (!user) {
    return false;
  }
  return user.role === role;
}

export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, USER_ROLES.admin);
}

export async function requireAuth(redirectTo = "/admin/login"): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

export async function requireAdmin(redirectTo = "/admin/login"): Promise<AuthUser> {
  const user = await requireAuth(redirectTo);
  if (!isAdmin(user)) {
    redirect("/");
  }
  return user;
}
