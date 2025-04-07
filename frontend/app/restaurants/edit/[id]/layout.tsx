"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RestaurantsCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div id="test">
      <div className="w-full h-8 flex fixed top-0 z-50 rounded-t-x">
        <button
          className="mt-4 ml-4 bg-black/20 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={() => router.back()}
        >
          <ChevronLeft className=" w-6 h-6 text-white" />
        </button>
      </div>
      <main>{children}</main>
    </div>
  );
}
