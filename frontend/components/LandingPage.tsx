"use client";
import Image from "next/image";
import Link from "next/link";
import { CustomButton } from "./helper-components/CustomButton";
import BaseHeader from "./header_footers/BaseHeader";
import { FooterMobile } from "./header_footers/FooterMobile";
export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen">
      <BaseHeader />
      <main className="flex flex-col items-center w-full flex-grow justify-between mt-16">
        {" "}
        <Image
          src="/home-banner.png"
          alt="home banner"
          layout="responsive"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
        <div className="flex flex-col items-center space-y-5 my-8 md:my-12 lg:my-16">
          {" "}
          <Link href="/register">
            <CustomButton className="w-50 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition duration-150 ease-in-out">
              S&apos;inscrire
            </CustomButton>
          </Link>
          <Link href="/login">
            <CustomButton className="w-50 button-primary-50w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out">
              Se connecter
            </CustomButton>
          </Link>
        </div>
        <div className="w-full">
          <Image
            src="/home-footer-banner.png"
            alt="footer home banner"
            layout="responsive"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </main>{" "}
      {/* Fin du contenu principal */}
      {/* Footer (FooterMobile est utilisé sur tous les écrans ici) */}
      {/* Si vous aviez un Footer différent pour Desktop, vous pourriez faire : */}
      {/* <div className="md:hidden"><FooterMobile /></div> */}
      {/* <div className="hidden md:block"><FooterDesktop /></div> */}
      <FooterMobile />
    </div>
  );
};
