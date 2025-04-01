import React from "react";
import { IconButton } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

interface CustomIconButtonProps {
  iconName: string;
  onClick?: () => void;
  title?: string;
  [x: string]: unknown; // Allow other props to be passed to IconButton
}

export const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  iconName,
  onClick,
  title,
  ...otherProps
}) => {
  const IconComponent = MuiIcons[`${iconName}` as keyof typeof MuiIcons];

  if (!IconComponent) {
    console.error(`Icon ${iconName}Icon not found in @mui/icons-material`);
    return null; // Or you could return a default icon or handle this differently
  }

  return (
    <IconButton onClick={onClick} {...otherProps}>
      <div className="flex flex-col items-center justify-end">
        <IconComponent className="text-black" />
        {title && <span className="text-[11px] text-black">{title}</span>}
      </div>
    </IconButton>
  );
};
