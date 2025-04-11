import Link from "next/link";
import { Home, Search, Bookmark, CircleUser } from "lucide-react";

export const ClientNavigationBar = ({
  selectedPage,
}: {
  selectedPage?: string;
}) => {
  return (
    <div className="w-full h-16 bg-white items-center justify-around flex fixed bottom-0 z-50 border-t-2 border-gray-200">
      <Link href="/home" className="flex flex-col items-center w-1/4">
        <Home className={selectedPage === "home" ? "text-primary-50" : ""} />
        <span
          className={selectedPage === "home" ? "text-primary-50" : ""}
          style={{ fontSize: "14px" }}
        >
          Accueil
        </span>
      </Link>
      <Link
        href="/orders/my-orders/all"
        className="flex flex-col items-center w-1/4"
      >
        <Bookmark
          className={selectedPage === "orders" ? "text-primary-50" : ""}
        />
        <span
          className={selectedPage === "orders" ? "text-primary-50" : ""}
          style={{ fontSize: "14px" }}
        >
          Commandes
        </span>
      </Link>
      <Link href="/account" className="flex flex-col items-center w-1/4">
        <CircleUser
          className={selectedPage === "account" ? "text-primary-50" : ""}
        />
        <span
          className={selectedPage === "account" ? "text-primary-50" : ""}
          style={{ fontSize: "14px" }}
        >
          Mon compte
        </span>
      </Link>
    </div>
  );
};
