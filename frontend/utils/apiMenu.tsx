import { Menu } from "@/types/Menu";
import axios from "axios";
import { serverURL } from "./serverURL";

const apiMenu = axios.create({
  baseURL: serverURL + "/menus",
  timeout: 5000,
});

export const getAllMenus = async (): Promise<Menu[]> => {
  try {
    const response = await apiMenu.get("/", {});
    const menus: Menu[] = response.data;
    console.log("Menus data retrieved:", menus);
    return menus;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Error during menus data retrieval:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error during menus data retrieval:", error);
    }
    throw error;
  }
};

export const getMenuByName = async (
  name: string,
  token: string
): Promise<Menu> => {
  try {
    const response = await apiMenu.get(
      `/${name}
      `,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const menu: Menu = response.data;
    console.log("Menu data retrieved:", menu);
    return menu;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Error during menu retrieval:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error during menu retrieval:", error);
    }
    throw error;
  }
};

export const getMenusByRestaurantId = async (
  restaurantId: number,
  token: string
): Promise<Menu[]> => {
  try {
    const response = await apiMenu.get(`/restaurant/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const menus: Menu[] = response.data;
    console.log("Menus data retrieved for restaurant:", menus);
    return menus;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Error during menu retrieval by restaurant ID:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Unexpected error during menu retrieval by restaurant ID:",
        error
      );
    }
    throw error;
  }
};

export const createMenu = async (menu: Menu, token: string): Promise<Menu> => {
  try {
    console.log("Creating menu:", menu);
    const response = await apiMenu.post("/create", menu, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const createdMenu: Menu = response.data;
    console.log("Menu created successfully:", createdMenu);
    return createdMenu;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Error during menu creation:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error during menu creation:", error);
    }
    throw error;
  }
};

export const updateMenu = async (
  id: number,
  menu: Menu,
  token: string
): Promise<Menu> => {
  try {
    const response = await apiMenu.put(`/${id}`, menu, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedMenu: Menu = response.data;
    console.log("Menu updated successfully:", updatedMenu);
    return updatedMenu;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Error during menu update:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error during menu update:", error);
    }
    throw error;
  }
};

export const deleteMenu = async (id: number, token: string): Promise<void> => {
  try {
    await apiMenu.delete(`/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Menu deleted successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Error during menu deletion:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error during menu deletion:", error);
    }
    throw error;
  }
};
