"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // 1. Importer useRouter
import { ArrowLeft } from "lucide-react"; // 2. Importer une icône (optionnel)

const PolicyPage = () => {
  const router = useRouter(); // 3. Obtenir l'instance du routeur

  // 4. Fonction pour gérer le retour
  const handleBack = () => {
    router.back();
  };

  return (
    // Ajout de 'relative' ici pour que le positionnement absolu du bouton fonctionne par rapport à ce conteneur
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 5. Bouton Retour */}
      <button
        onClick={handleBack}
        // Positionnement absolu en haut à gauche, en tenant compte du padding initial (px-4 sm:px-6 lg:px-8)
        // Ajustez top-X et left-X si nécessaire
        className="absolute top-4 left-4 sm:left-6 lg:left-8 z-10 inline-flex items-center justify-center gap-2 px-4 py-2 cursor-pointer"
        aria-label="Retour à la page précédente" // Pour l'accessibilité
      >
        <ArrowLeft /> {/* Icône */}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Ajout d'une marge supérieure (mt-10 ou plus) pour éviter que le contenu principal ne passe sous le bouton absolu
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Politique de Confidentialité
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bienvenue sur Cesi-Eat. Nous accordons une grande importance à la
              protection de vos données personnelles et à votre vie privée.
              Cette politique de confidentialité explique comment nous
              collectons, utilisons et protégeons vos informations lorsque vous
              utilisez notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Collecte des Données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous collectons les informations suivantes :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>Informations d&apos;identification (nom, prénom, email)</li>
              <li>Informations de paiement</li>
              <li>Adresse de livraison</li>
              <li>Historique des commandes</li>
              <li>Données de navigation et d&apos;utilisation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Utilisation des Données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>Traiter vos commandes et paiements</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des communications importantes</li>
              <li>Personnaliser votre expérience</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Protection des Données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles appropriées pour protéger vos données
              personnelles contre la perte, l'accès non autorisé, la
              divulgation, l'altération ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Partage des Données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous ne partageons vos données personnelles qu'avec :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>
                Les prestataires de services nécessaires à l'exécution de nos
                services
              </li>
              <li>Les autorités compétentes si requis par la loi</li>
              <li>
                Les partenaires de livraison pour la réalisation de vos
                commandes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Vos Droits
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience sur
              notre site. Vous pouvez contrôler et gérer les cookies dans les
              paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Modifications de la Politique
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les modifications prendront effet
              dès leur publication sur notre site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. Contact
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité
              ou l'utilisation de vos données personnelles, veuillez nous
              contacter à l'adresse suivante : privacy@cesi-eat.com
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyPage;
