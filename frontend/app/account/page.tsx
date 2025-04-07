"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { toast } from "react-toastify";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useMe } from "@/hooks/useMe";

const MyAccountPage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const { user, error, loading } = useMe(accessToken ?? ""); 


  // Redirect user if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    toast.info("Vous avez été déconnecté");
  };

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p>Redirection vers la page de connexion...</p>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl space-y-6">
          <div className="flex flex-row justify-between">
            <div></div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Mon Compte
            </h2>
            <Link href="/account/settings">
              <Settings className="cursor-pointer" />
            </Link>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <LoadingSpinner />
              <p className="mt-2 text-gray-600">
                Chargement des informations...
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md w-full text-center text-sm">
              {String(error)}
            </div>
          ) : user ? (
            <div className="space-y-4">
              <InfoItem label="Prénom" value={user.firstName} />
              <InfoItem label="Nom" value={user.lastName} />
              <InfoItem label="Email" value={user.email} />
              <InfoItem label="Téléphone" value={user.phoneNumber} />
              <InfoItem label="Adresse" value={user.address} />
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Aucune information de compte disponible.
            </p>
          )}
          {!loading && (
            <div className="pt-6">
              <CustomButton
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition duration-150 ease-in-out"
              >
                Se déconnecter
              </CustomButton>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper component to display an information line
const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

export default MyAccountPage;
