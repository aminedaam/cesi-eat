"use client";
import HeaderButtons from "@/components/header_footers/HeaderButtons";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { CustomIconButton } from "@/components/helper-components/CustomIconButton";
import HomeSearchBar from "@/components/HomeSearchBar";
import { LandingPage } from "@/components/LandingPage";
import { NavigationBar } from "@/components/NavigationBar";
import { RestaurantList } from "@/components/RestaurantList";
import { Restaurant } from "@/types/Restaurants";
import Image from "next/image";
import { useState } from "react";

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Bagaaaa",
    deliveryCosts: 4.99,
    image: "/burger.png",
    position: {
      latitude: 43.652777998548956,
      longitude: 1.4394687613763628,
    },
  },
  {
    id: 2,
    name: "Valentinoo",
    deliveryCosts: 4.99,
    image: "/burger.png",
    position: {
      latitude: 43.60304364458921,
      longitude: 1.4363026245644699,
    },
  },
  {
    id: 3,
    name: "Tacos",
    deliveryCosts: 4.99,
    image: "/tacos.png",
    position: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
  },
  {
    id: 4,
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
    position: {
      latitude: 48.853,
      longitude: 2.3499,
    },
  },
  {
    id: 5,
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
    position: {
      latitude: 43.50304364458921,
      longitude: 1.434,
    },
  },
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
            <HeaderButtons />
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
            <RestaurantList restaurants={restaurants} filter={searchTerm} />
            <CustomButton
              className="w-50 text-white button-primary-100"
              onClick={() => {
                setIsAuthenticated(false);
              }}
            >
              Logout
            </CustomButton>
          </div>
          <NavigationBar />
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
