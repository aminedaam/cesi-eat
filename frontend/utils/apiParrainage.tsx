import { Parrainage } from "@/types/Parrainage";
import axios from "axios";
import { serverURL } from "./serverURL";

const apiParrainage = axios.create({
  baseURL: serverURL + "/parrainages/",
  timeout: 5000,
});

export const createParrainage = async (
  idParrainne: number,
  codeParrainage: string,
  token: string
) => {
  try {
    console.log("Création du parrainage avec:", {
      idParrainne,
      codeParrainage,
    });
    const response = await apiParrainage.post(
      `create`,
      {
        idParrainne: idParrainne,
        codeParrainage: codeParrainage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Parrainage créé avec succès:", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la création du parrainage:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la création du parrainage:",
        error
      );
    }
    throw error;
  }
};

export const getAllParrainages = async (token: string) => {
  try {
    const response = await apiParrainage.get("all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des parrainages:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des parrainages:",
        error
      );
    }
    throw error;
  }
};
