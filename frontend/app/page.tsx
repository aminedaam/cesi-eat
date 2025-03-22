"use client";
import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <>
      {isAuthenticated ? (
        <div>
          <h1>Welcome to the home page</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between h-screen">
          <div className="w-full h-16 background-primary items-center justify-start flex">
            <Image
              src="/cesi-eat-logo.png"
              alt="logo"
              width={100}
              height={100}
            />
          </div>
            <Image
            src="/home-banner.png"
            alt="home banner"
            layout="responsive"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full"
            />
          <div className="justify-center items-center flex flex-col space-y-5 h-45">
            <CustomButton
              onClick={() => setIsAuthenticated(true)}
              className="w-50 text-white button-black"
            >
              Sign Up
            </CustomButton>
            <CustomButton
              onClick={() => setIsAuthenticated(true)}
              className="w-50 text-white button-primary-100"
            >
              Login
            </CustomButton>
          </div>
          <Image
            src="/home-footer-banner.png"
            alt="footer home banner"
            layout="responsive"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full"
          />
          <div className="w-full background-primary items-center justify-center flex flex-col py-4 space-y-5">
            <div className="flex space-x-5">
              <Image
                src="/app-store.png"
                alt="app store"
                width={100}
                height={50}
              />
              <Image
                src="/play-store.png"
                alt="play store"
                width={100}
                height={50}
              />
            </div>
            <Image
              src="/social-networks.png"
              alt="social networks"
              width={60}
              height={20}
            />
            <div className="flex  items-end justify-between w-full px-5">
              <div className="flex flex-col">
                <p className="text-black"> Politique de confidentialité</p>
                <p className="text-black"> Conditions générales</p>
              </div>
              <p className="text-black">© 2025 Cesi Eat</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
