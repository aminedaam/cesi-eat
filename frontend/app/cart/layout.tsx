"use client";
import { Bookmark, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
            className="focus:outline-none"
            aria-label="Retour"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <Link href="/orders" className="focus:outline-none flex items-center bg-gray-200 p-2 rounded-full">
            <Bookmark className="w-4 h-4 text-black mr-2" />
            <span className="text-sm font-medium text-black">Commandes</span>
          </Link>
        </div>
      </header>
      <main className="mt-16">{children}</main>
    </div>
  );
}
