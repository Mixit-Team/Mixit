import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  button?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  registration,
  error,
  type = 'text',
  placeholder,
  button,
  icon,
  iconPosition = 'right',
  ...rest
}) => {
  const paddingClass = icon ? (iconPosition === 'right' ? 'pr-10' : 'pl-10') : '';

  return (
    <div className="relative">
      {' '}
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          {' '}
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:border-orange-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'} ${paddingClass}`} // Apply padding class
            {...registration}
            {...rest}
          />
          {icon && (
            <div
              className={`absolute inset-y-0 flex items-center ${iconPosition === 'right' ? 'right-0 pr-3' : 'left-0 pl-3'}`}
            >
              {' '}
              {icon}
            </div>
          )}
        </div>
        {button && <div className="flex-shrink-0">{button}</div>}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputField;
