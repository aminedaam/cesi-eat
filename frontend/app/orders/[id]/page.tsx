"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommandeById } from "@/utils/apiCommandes";
import { Commande } from "@/types/Commandes";
import { useAuthStore } from "@/store/authStore";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetailPage() {
  const {id} = useParams()
  const commandeId = id as string;
  const router = useRouter();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchCommande = async () => {
      if (!commandeId || !token) {
        setError("Données manquantes pour charger la commande");
        setLoading(false);
        return;
      }

      try {
        const commandeData = await getCommandeById(commandeId, token);
        setCommande(commandeData);
      } catch (err) {
        console.error("Erreur lors de la récupération de la commande:", err);
        setError(
          "Impossible de charger les détails de la commande. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchCommande();
  }, [commandeId, token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="text-yellow-500 w-6 h-6" />;
      case "IN_PROGRESS":
        return <Loader2 className="text-blue-500 w-6 h-6 animate-spin" />;
      case "DELIVERED":
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case "CANCELLED":
        return <XCircle className="text-red-500 w-6 h-6" />;
      default:
        return <ShoppingBag className="text-gray-500 w-6 h-6" />;
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
      console.error("Erreur lors du formatage de la date:", error);
      return "Date invalide";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">
          Chargement des détails de la commande...
        </p>
      </div>
    );
  }

  if (error || !commande) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="mr-2" /> Retour aux commandes
        </button>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto"
          role="alert"
        >
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline">
            {" "}
            {error || "Commande non trouvée"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2" /> Retour aux commandes
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* En-tête avec image du restaurant et statut */}
        <div className="relative h-64 w-full">
          {commande.restaurant.imagePath ? (
            <Image
              src={commande.restaurant.imagePath}
              alt={commande.restaurant.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ShoppingBag className="text-gray-400 w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white text-center px-4">
              {commande.restaurant.name}
            </h1>
          </div>
          <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md flex items-center">
            {getStatusIcon(commande.status)}
            <span className="ml-2 font-medium">
              {getStatusText(commande.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Informations de la commande */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Détails de la commande
              </h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Clock className="mr-2 text-gray-500" />
                  <span>Commandée le: {formatDate(commande.createdAt)}</span>
                </p>
                <p className="flex items-center">
                  <ShoppingBag className="mr-2 text-gray-500" />
                  <span>Numéro de commande: #{commande.id}</span>
                </p>
                <p className="flex items-center font-semibold text-lg">
                  <span className="mr-2">Total:</span>
                  <span>{commande.prixTotal.toFixed(2)} €</span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Informations du restaurant
              </h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <MapPin className="mr-2 text-gray-500" />
                  <span>
                    {commande.restaurant.address},{" "}
                    {commande.restaurant.codePostal} {commande.restaurant.city}
                  </span>
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2 text-gray-500" />
                  <span>{commande.restaurant.phoneNumber}</span>
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2 text-gray-500" />
                  <span>
                    {commande.restaurant.email ?? "Email non disponible"}
                  </span>
                </p>
                <Link
                  href={`/restaurants/${commande.restaurant.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
                >
                  <ExternalLink className="mr-1" /> Voir le restaurant
                </Link>
              </div>
            </div>
          </div>

          {/* Articles commandés */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Articles commandés</h2>

            {commande.article.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Articles</h3>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Article
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Qté
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Prix
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {commande.article.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.price.toFixed(2)} €
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {(item.price * item.quantity).toFixed(2)} €
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {commande.menu.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Menus</h3>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Menu
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Qté
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Prix
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {commande.menu.map((item, index) => (
                            <tr
                              key={`menu-${index}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.price.toFixed(2)} €
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {(item.price * item.quantity).toFixed(2)} €
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
