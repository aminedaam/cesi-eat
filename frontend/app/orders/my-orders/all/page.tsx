"use client";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { getAllCommandesByClientId } from "@/utils/apiCommandes";
import { Commande } from "@/types/Commandes";
import { useAuthStore } from "@/store/authStore";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderListPage() {
  const { user } = useUserStore();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchCommandes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (!token) {
          setError("Vous devez être connecté pour voir vos commandes");
          setLoading(false);
          return;
        }

        if (user.id === undefined) {
          setError("ID utilisateur non disponible");
          setLoading(false);
          return;
        }

        const userCommandes = await getAllCommandesByClientId(user.id, token);
        setCommandes(userCommandes);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        setError(
          "Impossible de charger vos commandes. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [user, token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="text-yellow-500" />;
      case "IN_PROGRESS":
        return <Loader2 className="text-blue-500 animate-spin" />;
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
      case "IN_PROGRESS":
        return "En préparation";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erreur de formatage de la date:", error);
      return "Date invalide";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">Chargement de vos commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md"
          role="alert"
        >
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md"
          role="alert"
        >
          <strong className="font-bold">Attention!</strong>
          <span className="block sm:inline">
            {" "}
            Vous devez être connecté pour voir vos commandes.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mes commandes</h1>

      {commandes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm">
          <ShoppingBag className="text-gray-400 w-16 h-16 mb-4" />
          <p className="text-xl text-gray-600">
            Vous n&apos;avez pas encore passé de commande
          </p>
          <p className="text-gray-500 mt-2">
            Explorez nos restaurants et commencez à commander!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commandes.map((commande) => (
            <Link
              href={`/orders/${commande.id}`}
              key={commande.id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="relative h-48 w-full">
                  {commande.restaurant.imagePath ? (
                    <Image
                      src={commande.restaurant.imagePath}
                      alt={commande.restaurant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="text-gray-400 w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                    {getStatusIcon(commande.status)}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {commande.restaurant.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatDate(commande.createdAt)}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-sm font-medium">
                        {getStatusText(commande.status)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-auto">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold">
                        {commande.prixTotal.toFixed(2)} €
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Articles commandés:
                      </h3>
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {commande.article.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex justify-between"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>
                              {(item.price * item.quantity).toFixed(2)} €
                            </span>
                          </li>
                        ))}
                        {commande.menu.map((item, index) => (
                          <li
                            key={`menu-${index}`}
                            className="text-sm text-gray-600 flex justify-between"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>
                              {(item.price * item.quantity).toFixed(2)} €
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
