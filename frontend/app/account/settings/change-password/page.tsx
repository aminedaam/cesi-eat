"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import { updatePassword } from "@/utils/apiUser";
import { useMe } from "@/hooks/useMe";

const ChangePasswordPage: React.FC = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useMe(accessToken ?? "");
  if (!user || !accessToken) {
    router.replace("/login");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    if (!accessToken) {
      toast.error("Vous avez été déconnecté.");
      return;
    }

    setIsUpdating(true);
    try {
      await updatePassword(
        user!.id!,
        currentPassword,
        newPassword,
        accessToken
      );
      toast.success("Password updated successfully!");
      router.replace("/account/settings");
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Une erreur est survenue lors de la mise à jour du mot de passe.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    router.replace("/account/settings");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Modifier votre mot de passe
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-between space-x-4 pt-4">
              <CustomButton
                type="submit"
                disabled={isUpdating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isUpdating ? "Mise à jour..." : "Valider"}
              </CustomButton>
              <CustomButton
                type="button"
                onClick={handleCancel}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Annuler
              </CustomButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
