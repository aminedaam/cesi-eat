"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import SearchBar from "@/components/helper-components/SearchBar";
import { RestaurantList } from "@/components/RestaurantList";
import { CommandeList } from "@/components/CommandeList";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Bell, MapPin, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Commande } from "@/types/Commandes";
import { getAllCommandes, getAllCommandesByRestaurantId, getCommandesByStatus, updateCommande } from "@/utils/apiCommandes";
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
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const [errorCommandes, setErrorCommandes] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchCommandes = async () => {
      if (!accessToken || !user) return;
      
      setLoadingCommandes(true);
      setErrorCommandes(null);
      
      try {
        if (user.role === "RESTAURATEUR") {
          // Pour les restaurateurs, récupérer les commandes PENDING de leurs restaurants
          const userRestaurants = await getMyRestaurants(accessToken);
          const allCommandes = await Promise.all(
            userRestaurants.map(async (restaurant) => {
              const restaurantCommandes = await getAllCommandesByRestaurantId(restaurant.id!, accessToken);
              return restaurantCommandes.filter(commande => commande.status === "PENDING");
            })
          ).then(commandesArrays => commandesArrays.flat());
          const pendingCommandes = allCommandes.filter(
            (commande) => commande.status === "PENDING"
          );
          setCommandes(pendingCommandes);
        } else if (user.role === "LIVREUR") {
          // Pour les livreurs, récupérer toutes les commandes CONFIRMED
          const allCommandes = await getAllCommandes(accessToken);
          console.log(allCommandes);
          const confirmedCommandes = allCommandes.filter(
            (commande) => commande.status === "IN_PROGRESS"
          );
          setCommandes(confirmedCommandes);
          // getCommandesByStatus is not created yet
          // const allConfirmedCommandes = await getCommandesByStatus("IN_PROGRESS", accessToken);
          // setCommandes(allConfirmedCommandes);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        setErrorCommandes("Impossible de charger les commandes. Veuillez réessayer plus tard.");
      } finally {
        setLoadingCommandes(false);
      }
    };

    fetchCommandes();
  }, [accessToken, user]);

  const handleConfirmCommande = async (commandeId: number) => {
    if (!accessToken) return;
    
    try {
      // Trouver la commande à mettre à jour
      const commandeToUpdate = commandes.find(c => c.id === commandeId);
      if (!commandeToUpdate) return;
      
      // Mettre à jour le statut de la commande
      const updatedCommande = {
        ...commandeToUpdate,
        status: "IN_PROGRESS" as const
      };
      console.log(updatedCommande);
      
      // Envoyer la mise à jour au serveur
      await updateCommande(commandeId.toString(), updatedCommande, accessToken);
      
      // Mettre à jour l'état local
      setCommandes(commandes.filter(c => c.id !== commandeId));
      
      toast.success("Commande confirmée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la confirmation de la commande:", err);
      toast.error("Impossible de confirmer la commande. Veuillez réessayer.");
    }
  };

  const handleAcceptLivraison = async (commandeId: number) => {
    if (!accessToken) return;
    
    try {
      // Trouver la commande à mettre à jour
      const commandeToUpdate = commandes.find(c => c.id === commandeId);
      if (!commandeToUpdate) return;
      
      // Mettre à jour le statut de la commande
      const updatedCommande = {
        ...commandeToUpdate,
        status: "IN_PROGRESS" as const
      };
      
      // Envoyer la mise à jour au serveur
      await updateCommande(commandeId.toString(), updatedCommande, accessToken);
      
      // Mettre à jour l'état local
      setCommandes(commandes.filter(c => c.id !== commandeId));
      
      toast.success("Livraison acceptée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'acceptation de la livraison:", err);
      toast.error("Impossible d'accepter la livraison. Veuillez réessayer.");
    }
  };

  // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection est gérée dans le useEffect)
  if (!isLoggedIn) {
    return null;
  }

  // Si les données utilisateur sont en cours de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  // Si une erreur s'est produite lors du chargement des données utilisateur
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> Impossible de charger votre profil.</span>
        </div>
      </div>
    );
  }

  // Affichage conditionnel selon le rôle de l'utilisateur
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <BaseHeader>
        <div className="flex-1 mx-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="text-black placeholder-neutral-800 py-1 rounded-xl "
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

        {/* Contenu spécifique au rôle */}
        {user?.role === "CLIENT" && <RestaurantList filter={searchTerm} />}

        {(user?.role === "RESTAURATEUR" || user?.role === "LIVREUR") && (
          <div className="mt-6">
            <CommandeList
              commandes={commandes}
              loading={loadingCommandes}
              error={errorCommandes}
              userRole={user.role}
              onConfirmCommande={user.role === "RESTAURATEUR" ? handleConfirmCommande : undefined}
              onAcceptLivraison={user.role === "LIVREUR" ? handleAcceptLivraison : undefined}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
