"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CustomButton } from "@/components/helper-components/CustomButton";
// import { RestaurantArticle } from "@/types/RestaurantArticle";
import { useParams } from "next/navigation";
import { articles } from "@/mockData/articles";
import { restaurants } from "@/mockData/restaurants";

function RestaurantPage() {
  const { id } = useParams();
  const restaurantId = Number(id);
  const addItem = useCartStore((state) => state.addItem);
  const totalItemsFromCurrentRestaurant = useCartStore((state) =>
    state.getTotalItemsByRestaurantId(restaurantId)
  );

  const restaurant = restaurants.filter((r) => r.id == restaurantId)[0];

  const articlesFromRestaurant = articles.filter(
    (article) => article.restaurantId == restaurantId
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="relative w-full h-40">
        <Image
          src="/burger.png"
          alt="Restaurant Banner"
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <h1 className="text-center font-bold text-xl my-4">{restaurant.name}</h1>

      <ul className="p-4">
        {articlesFromRestaurant.map((article) => (
          <li
            key={article.id}
            className="flex items-center justify-between mb-4 border-b pb-4"
          >
            <div className="flex items-center">
              <Image
                src={article.imagePath}
                alt={article.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div className="ml-4">
                <h2 className="font-semibold">{article.name}</h2>
                <p className="text-sm text-gray-500">{article.price}</p>
                <p className="text-xs text-gray-400">{article.description}</p>
              </div>
            </div>
            <CustomButton
              className="text-2xl text-black font-bold"
              onClick={() => {
                addItem(article);
              }}
            >
              +
            </CustomButton>
          </li>
        ))}
      </ul>

      {totalItemsFromCurrentRestaurant > 0 && (
        <Link href={`/cart/${restaurantId}`}>
          {" "}
          <div className="flex justify-center">
            <button className="w-50 bg-black text-white py-2 rounded-md mb-6 fixed bottom-0">
              Voir mon panier ({totalItemsFromCurrentRestaurant})
            </button>
          </div>
        </Link>
      )}
    </div>
  );
}

export default RestaurantPage;
