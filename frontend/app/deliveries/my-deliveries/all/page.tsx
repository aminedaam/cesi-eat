"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/useMe";
import BaseHeader from "@/components/header_footers/BaseHeader";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { Commande } from "@/types/Commandes";
import { getAllCommandes } from "@/utils/apiCommandes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Image from "next/image";
import { LivreurNavigationBar } from "@/components/header_footers/LivreurNavigationBar";

const MyDeliveriesPage = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user, loading, error } = useMe(accessToken ?? "");
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const [errorCommandes, setErrorCommandes] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.push("/");
      return;
    }

    if (user && user.role !== "LIVREUR") {
      router.push("/home");
      return;
    }

    const fetchCommandes = async () => {
      if (!accessToken) return;

      setLoadingCommandes(true);
      setErrorCommandes(null);

      try {
        const allCommandes = await getAllCommandes(accessToken);
        setCommandes(allCommandes);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        setErrorCommandes(
          "Impossible de charger les commandes. Veuillez réessayer plus tard."
        );
      } finally {
        setLoadingCommandes(false);
      }
    };

    fetchCommandes();
  }, [accessToken, user, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="text-yellow-500" />;
      case "CONFIRMED":
        return <ShoppingBag className="text-blue-500" />;
      case "IN_PROGRESS":
        return <Truck className="text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="text-green-500" />;
      case "CANCELLED":
        return <XCircle className="text-red-500" />;
      default:
        return <ShoppingBag className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmée";
      case "IN_PROGRESS":
        return "En livraison";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <BaseHeader>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Mes livraisons</h1>
        </div>
      </BaseHeader>

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16 mb-20">
        {loadingCommandes ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : errorCommandes ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {errorCommandes}</span>
          </div>
        ) : commandes.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Aucune livraison trouvée</p>
            <p className="text-gray-400 mt-2">Aucune livraison n'est disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commandes.map((commande) => (
              <div
                key={commande.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-40 w-full bg-gray-200">
                  {commande.restaurant?.imagePath ? (
                    <Image
                      src={commande.restaurant.imagePath}
                      alt={commande.restaurant.name || "Restaurant"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="text-gray-400 w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                    {getStatusIcon(commande.status)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Commande #{commande.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {commande.createdAt && format(new Date(commande.createdAt), "PPP", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">Statut:</span>
                      <span className="flex items-center text-sm">
                        <span className="ml-1">{getStatusText(commande.status)}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600">
                      <span className="font-medium">Restaurant:</span>{" "}
                      {commande.restaurant?.name || "Non spécifié"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Client:</span>{" "}
                      {commande.client?.firstName} {commande.client?.lastName}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Adresse:</span>{" "}
                      {commande.client?.address || "Non spécifiée"}
                    </p>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total:</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {commande.prixTotal ? `${commande.prixTotal.toFixed(2)}€` : "Non spécifié"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <LivreurNavigationBar selectedPage="deliveries" />
    </div>
  );
};

export default MyDeliveriesPage; 