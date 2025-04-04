export interface RestaurantArticle {
    id: number;
    name: string; 
    description: string;
    imagePath: string;
    restaurantId: number;
    price: number
    typeProd: string,
    createdAt: number;
}