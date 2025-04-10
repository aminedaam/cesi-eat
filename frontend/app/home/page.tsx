"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import SearchBar from "@/components/helper-components/SearchBar";
import { RestaurantList } from "@/components/RestaurantList";
import { CommandeList } from "@/components/CommandeList";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Bell, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Commande } from "@/types/Commandes";
import {
  getAllCommandesByRestaurantId,
  getCommandesByStatus,
  updateCommandeStatus,
} from "@/utils/apiCommandes";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { toast } from "react-toastify";
import { getMyRestaurants } from "@/utils/apiRestaurant";

const HomePage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user, loading, error } = useMe(accessToken ?? "");
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [commandesDisponibles, setCommandesDisponibles] = useState<Commande[]>([]);
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const [loadingCommandesDisponibles, setLoadingCommandesDisponibles] = useState(false);
  const [errorCommandes, setErrorCommandes] = useState<string | null>(null);
  const [errorCommandesDisponibles, setErrorCommandesDisponibles] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleError = useCallback((err: unknown, setError: (error: string | null) => void, setCommandes: (commandes: Commande[]) => void) => {
    console.error("Erreur lors de la récupération des commandes:", err);
    if (err instanceof Error) {
      setCommandes([]);
    } else {
      setError("Impossible de charger les commandes. Veuillez réessayer plus tard.");
    }
  }, []);

  // useEffect pour les commandes en cours de livraison (IN_PROGRESS)
  useEffect(() => {
    const fetchCommandesEnCours = async () => {
      if (!accessToken || !user || user.role !== "LIVREUR") return;

      setLoadingCommandes(true);
      setErrorCommandes(null);

      try {
        const commandesEnCours = await getCommandesByStatus("IN_PROGRESS", accessToken);
        setCommandes(commandesEnCours);
      } catch (err) {
        handleError(err, setErrorCommandes, setCommandes);
      } finally {
        setLoadingCommandes(false);
      }
    };

    fetchCommandesEnCours();
  }, [accessToken, user, handleError]);

  // useEffect pour les commandes disponibles (CONFIRMED)
  useEffect(() => {
    const fetchCommandesDisponibles = async () => {
      if (!accessToken || !user || user.role !== "LIVREUR") return;

      setLoadingCommandesDisponibles(true);
      setErrorCommandesDisponibles(null);

      try {
        const commandesConfirmees = await getCommandesByStatus("CONFIRMED", accessToken);
        setCommandesDisponibles(commandesConfirmees);
      } catch (err) {
        handleError(err, setErrorCommandesDisponibles, setCommandesDisponibles);
      } finally {
        setLoadingCommandesDisponibles(false);
      }
    };

    fetchCommandesDisponibles();
  }, [accessToken, user, handleError]);

  // useEffect pour les commandes des restaurateurs
  useEffect(() => {
    const fetchCommandesRestaurateur = async () => {
      if (!accessToken || !user || user.role !== "RESTAURATEUR") return;

      setLoadingCommandes(true);
      setErrorCommandes(null);

      try {
        const userRestaurants = await getMyRestaurants(accessToken);
        const allCommandes = await Promise.all(
          userRestaurants.map(async (restaurant) => {
            const restaurantCommandes = await getAllCommandesByRestaurantId(
              restaurant.id!,
              accessToken
            );
            return restaurantCommandes.filter(
              (commande) => commande.status === "PENDING"
            );
          })
        ).then((commandesArrays) => commandesArrays.flat());
        const pendingCommandes = allCommandes.filter(
          (commande) => commande.status === "PENDING"
        );
        setCommandes(pendingCommandes);
      } catch (err) {
        handleError(err, setErrorCommandes, setCommandes);
      } finally {
        setLoadingCommandes(false);
      }
    };

    fetchCommandesRestaurateur();
  }, [accessToken, user, handleError]);

  const handleConfirmCommande = async (commandeId: number) => {
    if (!accessToken) return;

    try {
      await updateCommandeStatus(commandeId.toString(), "CONFIRMED", accessToken);
      setCommandes(commandes.filter((c) => c.id !== commandeId));
      toast.success("Commande confirmée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la confirmation de la commande:", err);
      toast.error("Impossible de confirmer la commande. Veuillez réessayer.");
    }
  };

  const handleAcceptLivraison = async (commandeId: number) => {
    if (!accessToken) return;

    try {
      await updateCommandeStatus(commandeId.toString(), "IN_PROGRESS", accessToken);
      const updatedCommandes = await getCommandesByStatus("IN_PROGRESS", accessToken);
      setCommandesDisponibles(commandesDisponibles.filter((c) => c.id !== commandeId));
      setCommandes(updatedCommandes);
      toast.success("Livraison acceptée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'acceptation de la livraison:", err);
      toast.error("Impossible d'accepter la livraison. Veuillez réessayer.");
    }
  };

  const handleFinLivraison = async (commandeId: number) => {
    if (!accessToken) return;

    try {
      await updateCommandeStatus(commandeId.toString(), "DELIVERED", accessToken);
      setCommandes(commandes.filter((c) => c.id !== commandeId));
      toast.success("Livraison terminée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la fin de la livraison:", err);
      toast.error("Impossible de terminer la livraison. Veuillez réessayer.");
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline">
            {" "}
            Impossible de charger votre profil.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16 mb-16">
      <BaseHeader>
        <div className="flex-1 mx-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="text-black placeholder-neutral-800 py-1 rounded-xl"
            placeHolder="Rechercher dans CesiEat..."
          />
        </div>
        <div className="flex flex-row space-x-3">
          <Bell />
          <Link href={"/cart"}>
            <ShoppingCart />
          </Link>
        </div>
      </BaseHeader>

      <main className="flex flex-col mt-16 max-w-7xl mx-auto px-4 py-8">
        <div className="w-full flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user?.role === "CLIENT" && "Passe ta commande !"}
              {user?.role === "RESTAURATEUR" && "Gestion des commandes"}
              {user?.role === "LIVREUR" && "Commandes à livrer"}
            </h1>
            <h4 className="text-gray-500 text-base">
              {user?.role === "CLIENT" && "À découvrir sur CesiEats"}
              {user?.role === "RESTAURATEUR" && "Commandes en attente de confirmation"}
              {user?.role === "LIVREUR" && "Commandes confirmées à livrer"}
            </h4>
          </div>
        </div>

        {user?.role === "CLIENT" && <RestaurantList filter={searchTerm} />}

        {(user?.role === "RESTAURATEUR" || user?.role === "LIVREUR") && (
          <div className="mt-6 space-y-6">
            {user?.role === "LIVREUR" && (
              <>
                <CommandeList
                  commandes={commandes}
                  loading={loadingCommandes}
                  error={errorCommandes}
                  userRole={user.role}
                  onConfirmCommande={undefined}
                  onAcceptLivraison={undefined}
                  onFinLivraison={handleFinLivraison}
                  isCommandesDisponibles={false}
                  title="Commandes en cours de livraison"
                />
                
                <CommandeList
                
                  commandes={commandesDisponibles}
                  loading={loadingCommandesDisponibles}
                  error={errorCommandesDisponibles}
                  userRole={user.role}
                  onConfirmCommande={undefined}
                  onAcceptLivraison={handleAcceptLivraison}
                  onFinLivraison={handleFinLivraison}
                  isCommandesDisponibles={true}
                  title="Commandes disponibles"
                />
              </>
            )}
            
            {user?.role === "RESTAURATEUR" && (
              <CommandeList
                commandes={commandes}
                loading={loadingCommandes}
                error={errorCommandes}
                userRole={user.role}
                onConfirmCommande={handleConfirmCommande}
                onAcceptLivraison={undefined}
                onFinLivraison={undefined}
                title="Commandes en attente"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
