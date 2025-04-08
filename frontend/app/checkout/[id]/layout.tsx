"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface CartLayoutProps {
  children: React.ReactNode;
}

export default function CartLayout({ children }: CartLayoutProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-50">
      <div className="flex items-center mb-6 mt-4 ml-4">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Finaliser la commande</h1>
        </div>
      </header>
      <main className="mt-16 pb-20">{children}</main>
    </div>
  );
}
