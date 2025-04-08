import React from "react";

interface InputProps {
  id: string;
  label?: string;
  type: string;
  placeholder: string;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  autoComplete?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
  className,
  ...props
}) => {
  return (
    <div>
      {label ? (
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={id}
        >
          {label}
        </label>
      ) : null}
      <input
        className={className || "shadow-2xl w-full appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
};

export default React.memo(Input);
