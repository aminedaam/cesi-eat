import React from "react";
import Input from "./Input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  placeHolder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  className,
  placeHolder,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Input
        id="search-bar"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeHolder || "Rechercher..."}
        className={className}
      />
    </div>
  );
};

export default SearchBar;
