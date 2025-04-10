"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartLayoutProps {
  children: React.ReactNode;
}

export default function CartLayout({ children }: CartLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-50">
        <div className="h-16 mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="focus:outline-none cursor-pointer"
            aria-label="Retour"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>
      <main className="mt-16">{children}</main>
    </div>
  );
}
