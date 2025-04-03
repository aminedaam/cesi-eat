"use client";

import { LandingPage } from "@/components/LandingPage";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  return <>{isLoggedIn ? router.push("/home") : <LandingPage />}</>;
}
