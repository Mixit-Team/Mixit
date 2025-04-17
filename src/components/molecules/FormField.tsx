import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

export interface FormFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  id: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  registration,
  id,
  type = 'text',
  placeholder,
  error,
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      <Input id={id} type={type} placeholder={placeholder} {...registration} error={error} />
    </div>
  );
};

export default FormField;
