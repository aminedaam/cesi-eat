import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "google";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isLoading = false,
      variant = "primary",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyle =
      "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = {
      primary:
        "text-white bg-black hover:bg-gray-800 focus:ring-gray-500 disabled:bg-gray-400",
      secondary:
        "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 disabled:bg-gray-100",
      google:
        "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 disabled:bg-gray-100", // Style like secondary for now
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyles[variant]} ${
          isLoading ? "cursor-not-allowed" : ""
        } ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          // Specific handling for Google button icon
          variant === "google" &&
          !isLoading && (
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 8.6 244 8.6c70.2 0 132.8 27.8 177.7 72.4l-63.1 61.7c-20.1-18.9-46.5-30.5-77.6-30.5-61.9 0-112.2 50.9-112.2 113.9s50.3 113.9 112.2 113.9c66.7 0 98.9-47.3 102.9-70.9H244V259.4h238.1c1.3 8.8 1.9 17.9 1.9 27.4z"
              ></path>
            </svg>
          )
        )}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
