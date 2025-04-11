"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import SearchBar from "@/components/helper-components/SearchBar";
import { RestaurantList } from "@/components/RestaurantList";
import { CommandeList } from "@/components/CommandeList";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Bell, ShoppingCart, Trash } from "lucide-react";
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
import { User } from "@/types/User";
import {
  getUsersByRole,
  updateUserStatus,
  deleteUser,
  getAllUsers,
} from "@/utils/apiUser";
import Modal from "@/components/helper-components/Modal";

const HomePage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user, loading, error } = useMe(accessToken ?? "");
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [commandesDisponibles, setCommandesDisponibles] = useState<Commande[]>(
    []
  );
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const [loadingCommandesDisponibles, setLoadingCommandesDisponibles] =
    useState(false);
  const [errorCommandes, setErrorCommandes] = useState<string | null>(null);
  const [errorCommandesDisponibles, setErrorCommandesDisponibles] = useState<
    string | null
  >(null);
  const [clients, setClients] = useState<User[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [errorClients, setErrorClients] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [errorAllUsers, setErrorAllUsers] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    email: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleError = useCallback(
    (
      err: unknown,
      setError: (error: string | null) => void,
      setCommandes: (commandes: Commande[]) => void
    ) => {
      console.error("Erreur lors de la récupération des commandes:", err);
      if (err instanceof Error) {
        setCommandes([]);
      } else {
        setError(
          "Impossible de charger les commandes. Veuillez réessayer plus tard."
        );
      }
    },
    []
  );

  // useEffect pour les commandes en cours de livraison (IN_PROGRESS)
  useEffect(() => {
    const fetchCommandesEnCours = async () => {
      if (!accessToken || !user || user.role !== "LIVREUR") return;

      setLoadingCommandes(true);
      setErrorCommandes(null);

      try {
        const commandesEnCours = await getCommandesByStatus(
          "IN_PROGRESS",
          accessToken
        );
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
        const commandesConfirmees = await getCommandesByStatus(
          "CONFIRMED",
          accessToken
        );
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

  // useEffect pour récupérer les clients (SERVICE_COMMERCIAL)
  useEffect(() => {
    const fetchClients = async () => {
      if (!accessToken || !user || user.role !== "SERVICE_COMMERCIAL") return;

      setLoadingClients(true);
      setErrorClients(null);

      try {
        const clientsList = await getUsersByRole("CLIENT", accessToken);
        setClients(clientsList);
      } catch (err) {
        console.error("Erreur lors de la récupération des clients:", err);
        setErrorClients("Impossible de charger la liste des clients.");
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [accessToken, user]);

  // useEffect pour récupérer tous les utilisateurs (SERVICE_COMMERCIAL)
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!accessToken || !user || user.role !== "SERVICE_COMMERCIAL") return;

      setLoadingAllUsers(true);
      setErrorAllUsers(null);

      try {
        const usersList = await getAllUsers(accessToken);
        const filteredUsers = usersList.filter(
          (user: User) =>
            user.role === "CLIENT" ||
            user.role === "RESTAURATEUR" ||
            user.role === "LIVREUR"
        );
        setAllUsers(filteredUsers);
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setErrorAllUsers("Impossible de charger la liste des utilisateurs.");
      } finally {
        setLoadingAllUsers(false);
      }
    };

    fetchAllUsers();
  }, [accessToken, user]);

  const handleConfirmCommande = async (commandeId: number) => {
    if (!accessToken) return;

    try {
      await updateCommandeStatus(
        commandeId.toString(),
        "CONFIRMED",
        accessToken
      );
      setCommandes(commandes.filter((c) => c.id !== commandeId.toString()));
      toast.success("Commande confirmée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la confirmation de la commande:", err);
      toast.error("Impossible de confirmer la commande. Veuillez réessayer.");
    }
  };

  const handleDeclineCommande = async (commandeId: number) => {
    if (!accessToken) return;

    try {
      await updateCommandeStatus(
        commandeId.toString(),
        "CANCELLED",
        accessToken
      );
      setCommandes(commandes.filter((c) => c.id !== commandeId.toString()));
      toast.success("Commande refusée avec succès !");
    } catch (err) {
      console.error("Erreur lors du refus de la commande:", err);
      toast.error("Impossible de refuser la commande. Veuillez réessayer.");
    }
  };

  const handleAcceptLivraison = async (commandeId: number) => {
    if (!accessToken) return;

    try {
      await updateCommandeStatus(
        commandeId.toString(),
        "IN_PROGRESS",
        accessToken
      );
      const updatedCommandes = await getCommandesByStatus(
        "IN_PROGRESS",
        accessToken
      );
      setCommandesDisponibles(
        commandesDisponibles.filter((c) => c.id !== commandeId.toString())
      );
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
      await updateCommandeStatus(
        commandeId.toString(),
        "DELIVERED",
        accessToken
      );
      setCommandes(commandes.filter((c) => c.id !== commandeId.toString()));
      toast.success("Livraison terminée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la fin de la livraison:", err);
      toast.error("Impossible de terminer la livraison. Veuillez réessayer.");
    }
  };

  const handleSuspendUser = async (userId: number) => {
    if (!accessToken) return;

    try {
      const newStatus =
        allUsers.find((u) => u.id === userId)?.status === "ACTIVE"
          ? "SUSPENDED"
          : "ACTIVE";
      await updateUserStatus(userId, newStatus, accessToken);
      setAllUsers(
        allUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.success(
        `Utilisateur ${
          newStatus === "ACTIVE" ? "réactivé" : "suspendu"
        } avec succès !`
      );
    } catch (err) {
      console.error(
        "Erreur lors de la modification du statut de l'utilisateur:",
        err
      );
      toast.error(
        "Impossible de modifier le statut de l'utilisateur. Veuillez réessayer."
      );
    }
  };

  const openDeleteModal = (user: {
    id: number;
    email: string;
    name: string;
  }) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!accessToken || !userToDelete) return;

    try {
      await deleteUser(userToDelete.email, accessToken);
      setAllUsers(allUsers.filter((user) => user.email !== userToDelete.email));
      toast.success("Utilisateur supprimé avec succès !");
      closeDeleteModal();
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      toast.error("Impossible de supprimer l'utilisateur. Veuillez réessayer.");
    }
  };

  const handleViewUser = (userId: number) => {
    router.push(`/account/${userId}`);
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
          {user?.role !== "SERVICE_COMMERCIAL" && (
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              className="text-black placeholder-neutral-800 py-1 rounded-xl"
              placeHolder="Rechercher dans CesiEat..."
            />
          )}
        </div>
        <div className="flex flex-row space-x-3">
          {user?.role === "CLIENT" && (
            <Link href={"/cart"}>
              <ShoppingCart />
            </Link>
          )}
        </div>
      </BaseHeader>

      <main className="flex flex-col mt-16 max-w-7xl mx-auto px-4 py-8">
        <div className="w-full flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user?.role === "CLIENT" && "Passe ta commande !"}
              {user?.role === "RESTAURATEUR" && "Gestion des commandes"}
              {user?.role === "LIVREUR" && "Commandes à livrer"}
              {user?.role === "SERVICE_COMMERCIAL" &&
                "Gestion des utilisateurs"}
            </h1>
            <h4 className="text-gray-500 text-base">
              {user?.role === "CLIENT" && "À découvrir sur CesiEats"}
              {user?.role === "RESTAURATEUR" &&
                "Commandes en attente de confirmation"}
              {user?.role === "LIVREUR" && "Commandes confirmées à livrer"}
            </h4>
          </div>
        </div>

        {user?.role === "CLIENT" && <RestaurantList filter={searchTerm} />}

        {user?.role === "SERVICE_COMMERCIAL" && (
          <div className="mt-8">
            <h4 className="text-gray-500 text-base mb-6 pl-2">
              Liste de tous les utilisateurs
            </h4>
            {loadingAllUsers ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : errorAllUsers ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {errorAllUsers}
              </div>
            ) : (
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nom
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rôle
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Statut
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewUser(user.id!)}
                            className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 cursor-pointer font-medium"
                          >
                            Consulter
                          </button>
                          <button
                            onClick={() => handleSuspendUser(user.id!)}
                            className={`px-3 py-1.5 rounded-md transition-colors duration-200 cursor-pointer font-medium ${
                              user.status === "ACTIVE"
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {user.status === "ACTIVE"
                              ? "Suspendre"
                              : "Réactiver"}
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal({
                                id: user.id!,
                                email: user.email,
                                name: `${user.firstName} ${user.lastName}`,
                              })
                            }
                            className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 cursor-pointer font-medium"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
                onDeclineCommande={handleDeclineCommande}
                onAcceptLivraison={undefined}
                onFinLivraison={undefined}
                title="Commandes en attente"
              />
            )}
          </div>
        )}
      </main>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.name} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteUser}
        icon={<Trash className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

export default HomePage;
