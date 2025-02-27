import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="group">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 transition-colors duration-300 group-focus-within:text-[#FF6B00]">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          {...props}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-700'
          } rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm transition-all duration-300 ${className}`}
        />
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#FF6B00] to-[#00E0FF] group-focus-within:w-full transition-all duration-300"></div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
