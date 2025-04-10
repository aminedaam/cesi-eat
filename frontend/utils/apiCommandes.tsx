import axios from "axios";
import { Commande } from "@/types/Commandes";
import { serverURL } from "./serverURL";

const apiCommandes = axios.create({
  baseURL: serverURL + "/commandes",
  timeout: 5000,
});

export const createCommande = async (
  commande: Commande,
  token: string
): Promise<Commande> => {
  try {
    const response = await apiCommandes.post("/create", commande, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const createdCommande: Commande = response.data;
    console.log("Commande créée avec succès:", createdCommande);
    return createdCommande;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la création de la commande:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la création de la commande :",
        error
      );
    }
    throw error;
  }
};

export const updateCommande = async (
  commandeId: string,
  updatedCommande: Commande,
  token: string
): Promise<Commande> => {
  try {
    const response = await apiCommandes.put(
      `/update/${commandeId}`,
      updatedCommande,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const updated: Commande = response.data;
    console.log("Commande mise à jour avec succès:", updated);
    return updated;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la mise à jour de la commande:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la mise à jour de la commande :",
        error
      );
    }
    throw error;
  }
};

export const deleteCommande = async (
  commandeId: string,
  token: string
): Promise<void> => {
  try {
    await apiCommandes.delete(`/delete/${commandeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Commande supprimée avec succès");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la suppression de la commande:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la suppression de la commande :",
        error
      );
    }
    throw error;
  }
};

export const getCommandeById = async (
  commandeId: string,
  token: string
): Promise<Commande> => {
  try {
    const response = await apiCommandes.get(`/get/${commandeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const commande: Commande = response.data;
    console.log("Commande récupérée avec succès:", commande);
    return commande;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération de la commande:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération de la commande :",
        error
      );
    }
    throw error;
  }
};

export const getAllCommandes = async (token: string): Promise<Commande[]> => {
  try {
    const response = await apiCommandes.get("/getAll", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const commandes: Commande[] = response.data;
    console.log("Commandes récupérées avec succès:", commandes);
    return commandes;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des commandes:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des commandes :",
        error
      );
    }
    throw error;
  }
};

export const getAllCommandesByRestaurantId = async (
  restaurantId: number,
  token: string
): Promise<Commande[]> => {
  try {
    const response = await apiCommandes.get(
      `/getAllByRestaurantId/${restaurantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const commandes: Commande[] = response.data;
    console.log("Commandes par restaurant récupérées avec succès:", commandes);
    return commandes;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des commandes par restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des commandes par restaurant :",
        error
      );
    }
    throw error;
  }
};

export const getAllCommandesByClientId = async (
  clientId: number,
  token: string
): Promise<Commande[]> => {
  try {
    const response = await apiCommandes.get(`/getAllByClientId/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const commandes: Commande[] = response.data;
    console.log("Commandes par client récupérées avec succès:", commandes);
    return commandes;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des commandes par client:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des commandes par client :",
        error
      );
    }
    throw error;
  }
};

export const getCommandesByStatus = async (
  status: string,
  token: string
): Promise<Commande[]> => {
  try {
    const response = await apiCommandes.get(`/getCommandesByStatus/${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const commandes: Commande[] = response.data;
    console.log("Commandes par statut récupérées avec succès:", commandes);
    return commandes;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des commandes par statut:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des commandes par statut :",
        error
      );
    }
    throw error;
  }
};

export const updateCommandeStatus = async (
  commandeId: string,
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED",
  token: string
): Promise<Commande> => {
  try {
    const response = await apiCommandes.put(
      `/update-status/${commandeId}`,
      status,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      }
    );
    const updatedCommande: Commande = response.data;
    console.log(
      "Statut de la commande mis à jour avec succès:",
      updatedCommande
    );
    return updatedCommande;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la mise à jour du statut de la commande:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la mise à jour du statut de la commande:",
        error
      );
    }
    throw error;
  }
};
