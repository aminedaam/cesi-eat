"use client";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { CustomIconButton } from "@/components/helper-components/CustomIconButton";
import HomeSearchBar from "@/components/HomeSearchBar";
import { LandingPage } from "@/components/LandingPage";
import { NavigationBar } from "@/components/NavigationBar";
import { Restaurant, RestaurantList } from "@/components/RestaurantList";
import Image from "next/image";
import { useState } from "react";

const restaurants: Restaurant[] = [
  {
    name: "Burger",
    deliveryCosts: 4.99,
    image: "/burger.png",
  },
  {
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
  },
  {
    name: "Tacos",
    deliveryCosts: 4.99,
    image: "/tacos.png",
  },
  {
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
  },
  {
    name: "Tacos",
    deliveryCosts: 4.99,
    image: "/tacos.png",
  },
  {
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
  },
  {
    name: "Tacos",
    deliveryCosts: 4.99,
    image: "/tacos.png",
  },
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isAuthenticated ? (
        <div>
          <div className="w-full h-16 background-primary items-center justify-between flex fixed top-0 z-50 rounded-b-xl">
            <CustomIconButton
              iconName="LocationOn"
              onClick={() => {
                console.log("Location icon pressed...");
              }}
            />
            <div className="flex-1 mx-4">
              <HomeSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                className="text-black placeholder-neutral-800 py-1 pl-3 pr-12 rounded-2xl"
              />
            </div>
            <CustomIconButton iconName="Notifications" />
            <CustomIconButton iconName="ShoppingCart" />
          </div>
          <div className="flex flex-col mx-4  my-16">
            <div className="w-full h-32 flex flex-row items-center justify-between">
              <div>
                <h1 className="font-bold text-xl">Passe ta commande !</h1>
                <h4 className="text-gray-500 text-base">
                  À découvrir sur CesiEats
                </h4>
              </div>
              <Image
                src="/cesi-eat-logo.png"
                alt="Logo"
                width={120}
                height={80}
              />
            </div>
            <RestaurantList restaurants={filteredRestaurants} />
            <CustomButton
              className="w-50 text-white button-primary-100"
              onClick={() => {
                setIsAuthenticated(false);
              }}
            >
              Logout
            </CustomButton>
            <NavigationBar />
          </div>
        </div>
      ) : (
        <LandingPage
          onLoginClick={() => {
            setIsAuthenticated(true);
          }}
          onSignupClick={() => {}}
        />
      )}
    </>
  );
}
