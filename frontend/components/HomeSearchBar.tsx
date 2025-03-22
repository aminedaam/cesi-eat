import React from "react";
import { CustomInput } from "./helper-components/CustomInput";

interface HomeSearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
    className,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <CustomInput
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Rechercher dans CesiEats"
        className={className}
      />
    </div>
  );
};

export default HomeSearchBar;
