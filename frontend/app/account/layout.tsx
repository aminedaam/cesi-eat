"use client";
import { ClientNavigationBar } from "@/components/header_footers/ClientNavigationBar";
import { LivreurNavigationBar } from "@/components/header_footers/LivreurNavigationBar";
import { RestaurateurNavigationBar } from "@/components/header_footers/RestaurateurNavigationBar";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");
  switch (user?.role) {
    case "RESTAURATEUR":
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <RestaurateurNavigationBar selectedPage={"account"} />
          <main>{children}</main>
        </div>
      );
    case "LIVREUR":
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <LivreurNavigationBar selectedPage={"account"} />
          <main>{children}</main>
        </div>
      );
    default:
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <ClientNavigationBar selectedPage={"account"} />
          <main>{children}</main>
        </div>
      );
  }
}
