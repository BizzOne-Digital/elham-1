import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { AdminUser } from "@/models/AdminUser";
import { USER_ROLES, type UserRole } from "@/lib/constants";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

function mapDbRole(role: string): UserRole {
  return role === "super_admin" ? USER_ROLES.admin : USER_ROLES.editor;
}

function getEnvAdminCredentials(): { email: string; passwordHash: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email: email.toLowerCase(), passwordHash: password };
}

async function verifyEnvAdminCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const admin = getEnvAdminCredentials();
  if (!admin || email.toLowerCase() !== admin.email) {
    return null;
  }

  const isValid =
    admin.passwordHash.startsWith("$2") ?
      await bcrypt.compare(password, admin.passwordHash)
    : password === admin.passwordHash;

  if (!isValid) {
    return null;
  }

  return {
    id: "env-admin",
    email: admin.email,
    name: "Netbrandit Admin",
    role: USER_ROLES.admin,
  };
}

async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  try {
    await connectDB();
    const admin = await AdminUser.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).lean<{ _id: { toString(): string }; email: string; name: string; role: string; passwordHash: string } | null>();

    if (admin) {
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return null;
      }

      await AdminUser.updateOne({ _id: admin._id }, { lastLoginAt: new Date() });

      return {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: mapDbRole(admin.role),
      };
    }
  } catch {
    // Fall through to env credentials when MongoDB is unavailable.
  }

  return verifyEnvAdminCredentials(email, password);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        return verifyAdminCredentials(email, password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.id = authUser.id;
        token.email = authUser.email;
        token.name = authUser.name;
        token.role = authUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
