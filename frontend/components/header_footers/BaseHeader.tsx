import Link from "next/link";
import Image from "next/image";
import React from "react";

const BaseHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  if (children) {
    return (
      <header className="w-full h-16 flex justify-between items-center z-50 bg-white border-b-2 border-gray-200 fixed top-0 p-4">
        {children}
      </header>
    );
  }
  return (
      <header className="w-full h-16 flex justify-between items-center z-50 bg-white border-b-2 border-gray-200 fixed top-0 p-4">
      <Link href="/">
        <Image src="/cesi-eat-logo.png" alt="logo" width={100} height={100} />
      </Link>{" "}
    </header>
  );
};

export default BaseHeader;
