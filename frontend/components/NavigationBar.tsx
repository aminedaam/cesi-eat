import Link from "next/link";
import { CustomIconButton } from "./helper-components/CustomIconButton";

export const NavigationBar = () => {
  return (
    <div className="w-full h-16 background-primary items-center justify-between flex fixed bottom-0 z-50 rounded-t-xl">
      <Link href="/">
        <CustomIconButton iconName="Home" title="Accueil" />
      </Link>
      <Link href="/browse">
        <CustomIconButton iconName="Search" title="Parcourir" />
      </Link>
      <Link href="/order">
        <CustomIconButton iconName="BookmarkBorder" title="Commandes" />
      </Link>
      <Link href="/account">
        <CustomIconButton iconName="Person" title="Mon Compte" />
      </Link>
    </div>
  );
};
