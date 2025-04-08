import { ArticleCartItem, MenuCartItem } from "@/store/cartStore";
import { CommandeArticle, CommandeMenu } from "@/types/Commandes";

export const convertArticleCartItemToCommandeArticle = (
  articleCartItem: ArticleCartItem
): CommandeArticle => {
  const { item, quantity } = articleCartItem;
  return {
    id: item.id?.toString(),
    name: item.name,
    description: item.description,
    price: item.price,
    quantity,
    restaurantId: item.restaurant?.id?.toString() ?? "",
    TypeProd: item.typeProd,
  };
};

export const convertMenuCartItemToCommandeMenu = (
  menuCartItem: MenuCartItem
): CommandeMenu => {
  const { item, quantity } = menuCartItem;
  return {
    id: item.id?.toString(),
    name: item.name,
    description: item.description,
    price: item.priceMenu,
    quantity,
    restaurantId: item.restaurant?.id?.toString() || "",
  };
};

export const convertArticleCartItemsToCommandeArticles = (
  articleCartItems: ArticleCartItem[]
): CommandeArticle[] => {
  return articleCartItems.map(convertArticleCartItemToCommandeArticle);
};

export const convertMenuCartItemsToCommandeMenus = (
  menuCartItems: MenuCartItem[]
): CommandeMenu[] => {
  return menuCartItems.map(convertMenuCartItemToCommandeMenu);
};
