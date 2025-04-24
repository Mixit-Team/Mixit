import React, { forwardRef, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isLoading = false,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center rounded-md border font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors duration-150';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'border-transparent bg-[#fd7a19] text-white hover:bg-[#d36615] focus:ring-[#fd7a19] disabled:bg-orange-200 disabled:text-orange-700',
      secondary:
        'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400',
      outline:
        'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500 disabled:bg-white disabled:text-gray-400 disabled:border-gray-200',
    };

    const combinedClassName = `
      ${baseStyle}
      ${sizeStyles[size]}
      ${className} 
      ${variantStyles[variant]}
      ${fullWidth ? 'w-full' : ''}
      ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
      ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    `;

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={combinedClassName.replace(/\s+/g, ' ').trim()}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading ? (
          <svg
            className="mr-2 -ml-1 h-5 w-5 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="presentation"
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
        ) : null}
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
