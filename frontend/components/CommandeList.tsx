"use client";

import React from "react";
import { Commande } from "@/types/Commandes";
import { formatDate } from "@/utils/formatDate";
import LoadingSpinner from "./helper-components/LoadingSpinner";

interface CommandeListProps {
  commandes: Commande[];
  loading: boolean;
  error: string | null;
  userRole: "CLIENT" | "RESTAURATEUR" | "LIVREUR";
  onConfirmCommande?: (commandeId: number) => void;
  onAcceptLivraison?: (commandeId: number) => void;
}

export const CommandeList: React.FC<CommandeListProps> = ({
  commandes,
  loading,
  error,
  userRole,
  onConfirmCommande,
  onAcceptLivraison,
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
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-lg">
          {userRole === "RESTAURATEUR"
            ? "Aucune commande en attente pour le moment."
            : "Aucune commande confirmée à livrer pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {commandes.map((commande) => (
        <div
          key={commande.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {commande.restaurant.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {formatDate(commande.createdAt)}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {commande.status}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>
                      Client: {commande.client.firstName}{" "}
                      {commande.client.lastName}
                    </p>
                    <p>Adresse: {commande.client.address}</p>
                  </div>
                  {userRole === "RESTAURATEUR" && onConfirmCommande && (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => onConfirmCommande(commande.id!)}
                    >
                      Confirmer
                    </button>
                  )}
                  {userRole === "LIVREUR" && onAcceptLivraison && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => onAcceptLivraison(commande.id!)}
                    >
                      Accepter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 