"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { deleteUser } from "@/utils/apiUser";
import { customModalStyles } from "@/components/CustomModalStyles";
import { useMe } from "@/hooks/useMe";

if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}

const UserSettingsPage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const { user } = useMe(accessToken ?? "");
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteAccount = async () => {
    if (!accessToken) return;

    closeDeleteModal();

    try {
      await deleteUser(user!.email!, accessToken);
      console.log(user!.email);
      toast.success("Account deleted successfully.");
      logout();
      router.replace("/register");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Une erreur est survenue lors de la suppression de votre compte.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Paramètres utilisateur
          </h2>
          <div className="space-y-4">
            <CustomButton
              onClick={() => router.push("/account/settings/edit")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black button-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Modifier mes informations
            </CustomButton>
            <CustomButton
              onClick={() => router.push("/account/settings/change-password")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black button-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Modifier mon mot de passe
            </CustomButton>
            <CustomButton
              onClick={openDeleteModal}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-100"
            >
              Supprimer mon compte
            </CustomButton>
          </div>
        </div>
      </main>

      {/* Modal for account deletion */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirm Account Deletion"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne
            peut pas être annulée.
          </p>
          <div className="flex justify-end space-x-3">
            <CustomButton
              onClick={closeDeleteModal}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmDeleteAccount}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Confirmer la suppression
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserSettingsPage;
