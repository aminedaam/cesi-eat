type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  type,
}) => {
  return (
    <button
      type={type}
      className={`p-2 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
