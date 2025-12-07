import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange, onBlur, error, placeholder, children }) => {
  const hasError = !!error;
  const isTouchedAndValid = value && !error;

  const baseInputClasses = "w-full px-4 py-2.5 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200";
  const errorInputClasses = "border-red-500 focus:ring-red-400";
  const successInputClasses = "border-green-500 focus:ring-green-400";
  const neutralInputClasses = "border-gray-300 dark:border-gray-600 focus:ring-blue-500";
  
  const inputClasses = `${baseInputClasses} ${
    hasError ? errorInputClasses : (isTouchedAndValid ? successInputClasses : neutralInputClasses)
  }`;
  
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
        {children && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {children}
          </div>
        )}
      </div>
      <div className="h-4">
        {hasError && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default InputField;
