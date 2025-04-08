// src/components/payment/CreditCardForm.tsx ou chemin similaire

"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import { CreditCard } from "lucide-react";

// --- Interface pour les props ---
interface CreditCardFormProps {
  onValidityChange: (isValid: boolean) => void; // Callback pour informer le parent
}
// -----------------------------

// --- Utiliser les props ---
const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onValidityChange,
}) => {
  // -------------------------

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  // --- Calcul et communication de la validité ---
  useEffect(() => {
    // Définir les règles de validité (simplistes pour ce formulaire fake)
    const isCardNumberValid = cardNumber.replace(/\s/g, "").length >= 13; // Au moins 13 chiffres
    const isExpiryDateValid = /^\d{2}\/\d{2}$/.test(expiryDate); // Format MM/AA
    const isCvcValid = cvc.length >= 3 && cvc.length <= 4; // 3 ou 4 chiffres
    const isCardNameValid = cardName.trim() !== ""; // Non vide

    const overallValidity =
      isCardNumberValid && isExpiryDateValid && isCvcValid && isCardNameValid;

    // Appeler le callback pour informer le parent
    onValidityChange(overallValidity);
  }, [cardNumber, expiryDate, cvc, cardName, onValidityChange]); // Dépendances: états des inputs + callback
  // -------------------------------------------

  // --- Formatage simple pour la date d'expiration (MM/AA) ---
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  // --- Formatage simple pour le numéro de carte (espaces) ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.match(/.{1,4}/g)?.join(" ") ?? "";
    setCardNumber(formattedValue.substring(0, 19));
  };

  // --- Fausse soumission ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Vérifier la validité avant de simuler (même si le bouton principal est peut-être déjà désactivé)
    const isValid =
      cardNumber.replace(/\s/g, "").length >= 13 &&
      /^\d{2}\/\d{2}$/.test(expiryDate) &&
      cvc.length >= 3 &&
      cvc.length <= 4 &&
      cardName.trim() !== "";

    if (!isValid) {
      alert("Veuillez remplir correctement tous les champs de la carte.");
      return;
    }

    console.log("Tentative de paiement (FAUX) avec les données:", {
      cardNumber,
      expiryDate,
      cvc,
      cardName,
    });

    setTimeout(() => {
      alert("Traitement du paiement simulé terminé !");
    }, 2000);
  };

  // --- Le reste du JSX reste identique ---
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
        Informations de paiement
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Numéro de carte */}
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Numéro de carte
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            inputMode="numeric"
            autoComplete="cc-number"
          />
        </div>
        {/* Nom sur la carte */}
        <div>
          <label
            htmlFor="cardName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom sur la carte
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Prénom Nom"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            autoComplete="cc-name"
          />
        </div>
        {/* Expiration & CVC */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiration (MM/AA)
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={expiryDate}
              onChange={handleExpiryChange}
              placeholder="MM/AA"
              maxLength={5}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              inputMode="numeric"
              autoComplete="cc-exp"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="cvc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={cvc}
              onChange={(e) =>
                setCvc(e.target.value.replace(/\D/g, "").substring(0, 4))
              }
              placeholder="123"
              maxLength={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              inputMode="numeric"
              autoComplete="cc-csc"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;
