"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loginFormSchema, type LoginFormInput } from "@/lib/validation/common";
import { FormField, Input } from "@/components/admin/FormField";
import { BRAND } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(data: LoginFormInput) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Email" name="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          {...register("email")}
        />
      </FormField>
      <FormField label="Password" name="password" error={errors.password?.message} required>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          {...register("password")}
        />
      </FormField>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Signing in..." : `Sign in to ${BRAND.name}`}
      </button>
    </form>
  );
}
