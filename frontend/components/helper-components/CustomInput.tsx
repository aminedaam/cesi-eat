/**
 * Renders a text input field with customizable placeholder, value, and change handler.
 *
 * @param {string}  placeholder - Placeholder text for the input field
 * @param {string}  value - Current value of the input field
 * @param {(s: string) => void}  onChange - Callback function to handle changes to the input field
 * @returns {JSX.Element} A text input element wrapped in a div
 */
interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

export const CustomInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  className,
}) => {
  return (
    <div>
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        value={value}
      />
    </div>
  );
};
