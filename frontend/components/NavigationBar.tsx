import { CustomIconButton } from "./helper-components/CustomIconButton";

export const NavigationBar = () => {
  return (
    <div className="w-full h-16 background-primary items-center justify-between flex fixed bottom-0 z-50 rounded-t-xl">
      <CustomIconButton
        iconName="Home"
        title="Accueil"
        onClick={() => {
          console.log("Accueil clicked");
        }}
      />
      <CustomIconButton
        iconName="LocalCafe"
        title="Courses"
        onClick={() => {
          console.log("Courses clicked");
        }}
      />
      <CustomIconButton
        iconName="Search"
        title="Parcourir"
        onClick={() => {
          console.log("Parcourir clicked");
        }}
      />
      <CustomIconButton
        iconName="BookmarkBorder"
        title="Commandes"
        onClick={() => {
          console.log("Commandes clicked");
        }}
      />
      <CustomIconButton
        iconName="Person"
        title="Mon Compte"
        onClick={() => {
          console.log("Mon Compte clicked");
        }}
      />
    </div>
  );
};
