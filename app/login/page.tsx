"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginBackground from "@/components/LoginBackground";
import LoginForm from "@/components/LoginForm";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, checkSession } = useAuthStore();

  useEffect(() => { checkSession(); }, [checkSession]);
  useEffect(() => { if (isAuthenticated) router.push("/"); }, [isAuthenticated, router]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <LoginBackground />
      <div className="relative z-10 w-full max-w-[420px] px-4 py-8">
        <LoginForm />
        <p className="text-center mt-6" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em" }}>
          KICKFORGE &mdash; WHERE MOTION MEETS CRAFT
        </p>
      </div>
    </div>
  );
}
