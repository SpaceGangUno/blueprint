import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gradient';
  isLoading?: boolean;
  animated?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  animated = true,
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300';
  
  const variants = {
    primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
    accent: 'border-transparent text-white bg-purple-600 hover:bg-purple-700',
    gradient: 'border-transparent text-white bg-gradient-primary animate-gradient hover:shadow-lg'
  };

  const animationClass = animated ? 'hover-lift' : '';

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${animationClass} ${className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : children}
    </button>
  );
}
