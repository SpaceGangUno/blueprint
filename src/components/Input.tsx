import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="group">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 transition-colors duration-300 group-focus-within:text-blue-600">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          {...props}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300`}
        />
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 group-focus-within:w-full transition-all duration-300"></div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
