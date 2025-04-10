"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/useMe";
import { User } from "@/types/User";
import { getUserById, updateUserStatus, deleteUser } from "@/utils/apiUser";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { toast } from "react-toastify";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { ArrowLeft, Trash } from "lucide-react";
import Modal from "@/components/helper-components/Modal";

interface PageProps {
  params: {
    id: string;
  };
}

const UserDetailPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user: currentUser, loading: loadingCurrentUser } = useMe(accessToken ?? "");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!accessToken || !currentUser || currentUser.role !== "SERVICE_COMMERCIAL") {
      router.push("/home");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getUserById(parseInt(params.id), accessToken);
        setUser(userData);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        setError("Impossible de charger les informations de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken, currentUser, params.id, router]);

  const handleSuspendUser = async () => {
    if (!accessToken || !user) return;

    try {
      const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      await updateUserStatus(user.id!, newStatus, accessToken);
      setUser({ ...user, status: newStatus });
      toast.success(`Utilisateur ${newStatus === "ACTIVE" ? "réactivé" : "suspendu"} avec succès !`);
    } catch (err) {
      console.error("Erreur lors de la modification du statut de l'utilisateur:", err);
      toast.error("Impossible de modifier le statut de l'utilisateur. Veuillez réessayer.");
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!accessToken || !user) return;

    try {
      await deleteUser(user.email, accessToken);
      toast.success("Utilisateur supprimé avec succès !");
      router.push("/home");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      toast.error("Impossible de supprimer l'utilisateur. Veuillez réessayer.");
    }
  };

  if (loadingCurrentUser || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement des informations...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error || "Utilisateur non trouvé"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BaseHeader>
      </BaseHeader>

      <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <button
          onClick={() => router.push("/home")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="mr-2" />
          Retour
        </button>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSuspendUser}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer font-medium ${
                    user.status === "ACTIVE" 
                      ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {user.status === "ACTIVE" ? "Suspendre" : "Réactiver"}
                </button>
                <button
                  onClick={openDeleteModal}
                  className="px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 cursor-pointer font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <p className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {user.status}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                  <p className="mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                  <p className="mt-1 text-gray-900">{user.phoneNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                  <p className="mt-1 text-gray-900">
                    {user.address}
                    <br />
                    {user.postalCode} {user.city}
                    <br />
                    {user.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Coordonnées</h3>
                  <p className="mt-1 text-gray-900">
                    Latitude: {user.latitude || "Non disponible"}
                    <br />
                    Longitude: {user.longitude || "Non disponible"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user?.firstName} ${user?.lastName} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteUser}
        icon={<Trash className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

export default UserDetailPage; 