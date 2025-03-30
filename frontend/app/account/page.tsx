"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";

// Interface simple pour les données utilisateur (à adapter selon votre API)
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // Ajoutez d'autres champs si nécessaire
}

const MyAccountPage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  // États pour gérer le chargement et les données utilisateur
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login"); // Remplace l'historique pour ne pas revenir ici avec "back"
    }
  }, [isLoggedIn, router]);

  // Simuler la récupération des données utilisateur au montage
  useEffect(() => {
    // Seulement si on est connecté et qu'on a un token
    if (isLoggedIn && accessToken) {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        setError(null);
        console.log(
          "Fetching user profile with token:",
          accessToken.substring(0, 10) + "..."
        );
        try {
          // --- DANS UNE VRAIE APP : APPELEZ VOTRE API ICI ---
          // Exemple: const response = await fetch('/api/user/profile', {
          //   headers: { 'Authorization': `Bearer ${accessToken}` }
          // });
          // if (!response.ok) throw new Error("Erreur réseau");
          // const data: UserProfile = await response.json();

          // --- SIMULATION ---
          await new Promise((resolve) => setTimeout(resolve, 750)); // Simule un délai réseau
          const simulatedData: UserProfile = {
            firstName: "Caca",
            lastName: "Prout",
            email: "cacaprout@email.com", // Cet email devrait venir de l'API, pas du store ici
            role: "CLIENT",
          };
          // --- FIN SIMULATION ---

          setUserProfile(simulatedData);
        } catch (err) {
          console.error("Erreur lors de la récupération du profil:", err);
          setError("Impossible de charger les informations du compte.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    } else if (!isLoggedIn) {
      // Si l'utilisateur se déconnecte pendant le chargement initial
      setIsLoading(false);
    }
  }, [isLoggedIn, accessToken]); // Dépendances importantes

  const handleLogout = () => {
    logout();
  };

  // Affichage pendant la redirection si pas connecté
  if (!isLoggedIn && !isLoading) {
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
          {" "}
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Mon Compte
          </h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <LoadingSpinner />
              <p className="mt-2 text-gray-600">
                Chargement des informations...
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md w-full text-center text-sm">
              {error}
            </div>
          ) : userProfile ? (
            <div className="space-y-4">
              <InfoItem label="Prénom" value={userProfile.firstName} />
              <InfoItem label="Nom" value={userProfile.lastName} />
              <InfoItem label="Email" value={userProfile.email} />
              <InfoItem label="Rôle" value={userProfile.role} />
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Aucune information de compte disponible.
            </p>
          )}
          {!isLoading && (
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
