import React from "react";
import { CustomIconButton } from "../helper-components/CustomIconButton";
const HeaderButtons: React.FC = () => {
  return (
    <div>
      <CustomIconButton iconName="Notifications" />
      <CustomIconButton iconName="ShoppingCart" />
    </div>
  );
};

export default HeaderButtons;
