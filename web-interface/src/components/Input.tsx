import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const inputClasses = `
      bg-gray-800 
      text-gray-200 
      border 
      ${error ? 'border-red-500' : 'border-gray-700'} 
      rounded-md 
      px-4 
      py-2 
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500 
      focus:border-transparent
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-gray-300 mb-2 font-medium">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;