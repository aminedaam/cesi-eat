"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { toast } from "react-toastify";
import Link from "next/link";
import { Settings, Gift } from "lucide-react";
import { useMe } from "@/hooks/useMe";
import Modal from "react-modal";
import { customModalStyles } from "@/components/CustomModalStyles";

if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}

const MyAccountPage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const { user, error, loading } = useMe(accessToken ?? ""); 
  const [showParrainModal, setShowParrainModal] = useState(false);

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
            <div className="pt-6 space-y-4">
              <CustomButton
                onClick={() => setShowParrainModal(true)}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 "
              >
                <Gift size={18} />
                Obtenir mon code parrain
              </CustomButton>
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

      <Modal
        isOpen={showParrainModal}
        onRequestClose={() => setShowParrainModal(false)}
        style={customModalStyles}
        contentLabel="Code Parrain"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Votre code parrain</h3>
            <button
              onClick={() => setShowParrainModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Partagez ce code avec vos amis :</p>
            <div className="bg-white p-3 rounded-md border border-purple-200">
              <p className="text-2xl font-mono font-bold text-purple-600">{user?.codeParrainage || "Aucun code disponible"}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <CustomButton
              onClick={() => setShowParrainModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Fermer
            </CustomButton>
          </div>
        </div>
      </Modal>
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
