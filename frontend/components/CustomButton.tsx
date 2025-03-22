interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button className={`p-2 ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
