"use client";

import React from "react";
import { Commande } from "@/types/Commandes";
import { formatDate } from "@/utils/formatDate";
import LoadingSpinner from "./helper-components/LoadingSpinner";
import { Clock, Loader2, CheckCircle, XCircle, ShoppingBag, Truck, MapPin } from "lucide-react";
import Link from "next/link";

interface CommandeListProps {
  commandes: Commande[];
  loading: boolean;
  error: string | null;
  userRole: "CLIENT" | "RESTAURATEUR" | "LIVREUR";
  onConfirmCommande?: (commandeId: number) => void;
  onAcceptLivraison?: (commandeId: number) => void;
  onFinLivraison?: (commandeId: number) => void;
  isCommandesDisponibles?: boolean;
  title?: string;
}

const getEmptyMessage = (userRole: string, isCommandesDisponibles: boolean): string => {
  if (userRole === "RESTAURATEUR") {
    return "Aucune commande en attente pour le moment.";
  }
  if (userRole === "LIVREUR") {
    return isCommandesDisponibles
      ? "Aucune commande disponible pour le moment."
      : "Aucune commande en cours de livraison.";
  }
  return "Aucune commande pour le moment.";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="text-yellow-500 w-5 h-5" />;
    case "CONFIRMED":
      return <ShoppingBag className="text-blue-500 w-5 h-5" />;
    case "IN_PROGRESS":
      return <Truck className="text-purple-500 w-5 h-5" />;
    case "DELIVERED":
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    case "CANCELLED":
      return <XCircle className="text-red-500 w-5 h-5" />;
    default:
      return <ShoppingBag className="text-gray-500 w-5 h-5" />;
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

const CommandeItem: React.FC<{
  commande: Commande;
  userRole: string;
  onConfirmCommande?: (commandeId: number) => void;
  onAcceptLivraison?: (commandeId: number) => void;
  onFinLivraison?: (commandeId: number) => void;
  isCommandesDisponibles?: boolean;
}> = ({
  commande,
  userRole,
  onConfirmCommande,
  onAcceptLivraison,
  onFinLivraison,
  isCommandesDisponibles = false,
}) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {commande.restaurant?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {formatDate(commande.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          {getStatusIcon(commande.status)}
          <span className="text-sm font-medium text-gray-700">
            {getStatusText(commande.status)}
          </span>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Total</span>
        <span className="font-semibold">
          {commande.prixTotal?.toFixed(2)} €
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Articles commandés:
        </h3>
        <ul className="space-y-1 max-h-40 overflow-y-auto">
          {commande.article.map((item, index) => (
            <li
              key={`article-${index}`}
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

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>
              Client: {commande.client.firstName}{" "}
              {commande.client.lastName}
            </p>
            <p>Adresse: {commande.client.address}</p>
          </div>
          <div className="flex gap-2">
            {userRole === "RESTAURATEUR" && onConfirmCommande && (
              <button
                className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => onConfirmCommande(commande.id!)}
              >
                Confirmer
              </button>
            )}
            {userRole === "LIVREUR" && onAcceptLivraison && (
              <button
                className={`${
                  isCommandesDisponibles
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                onClick={() => onAcceptLivraison(commande.id!)}
              >
                {isCommandesDisponibles ? "Prendre en charge" : "Accepter"}
              </button>
            )}
            {userRole === "LIVREUR" && onFinLivraison && commande.status === "IN_PROGRESS" && (
              <button
                className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => onFinLivraison(commande.id!)}
              >
                Livraison terminée
              </button>
            )}
          </div>
        </div>
        
        {/* Bouton pour afficher la commande sur la carte */}
        {userRole === "LIVREUR" && commande.client.latitude && commande.client.longitude && (
          <div className="mt-4 flex justify-end">
            <Link 
              href={`/map?lat=${commande.client.latitude}&lng=${commande.client.longitude}&auto=true`}
              className="inline-flex items-center bg-white hover:bg-primary-700 text- black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Voir sur la carte
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const CommandeList: React.FC<CommandeListProps> = ({
  commandes,
  loading,
  error,
  userRole,
  onConfirmCommande,
  onAcceptLivraison,
  onFinLivraison,
  isCommandesDisponibles = false,
  title,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <p className="ml-3 text-gray-600">Chargement des commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (commandes.length === 0) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            {getEmptyMessage(userRole, isCommandesDisponibles)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commandes.map((commande) => (
          <CommandeItem
            key={commande.id}
            commande={commande}
            userRole={userRole}
            onConfirmCommande={onConfirmCommande}
            onAcceptLivraison={onAcceptLivraison}
            onFinLivraison={onFinLivraison}
            isCommandesDisponibles={isCommandesDisponibles}
          />
        ))}
      </div>
    </div>
  );
}; 