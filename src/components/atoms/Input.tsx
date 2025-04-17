import React, { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

export const Input: React.FC<InputProps> = ({ error, ...props }) => {
  return (
    <>
      <input {...props} className={`w-full rounded border p-2 ${error ? 'border-red-500' : ''}`} />
      {error && <span className="text-sm text-red-500">{error.message}</span>}
    </>
  );
};

export default Input;
