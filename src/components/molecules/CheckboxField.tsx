import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

type InputHTMLProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'onBlur' | 'onChange' | 'ref' | 'checked' | 'type'
>;

interface CheckboxFieldProps extends InputHTMLProps {
  label: React.ReactNode;
  id: string;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
  labelClassName?: string;
  inputClassName?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  registration,
  error,
  labelClassName = 'ml-2 text-sm text-gray-700',
  inputClassName = 'h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500',
  checked,
  onChange: customOnChange,
  ...rest
}) => {
  const { ref, onChange: rhfOnChange, onBlur: rhfOnBlur, name } = registration || {};

  const handleChange = customOnChange
    ? customOnChange
    : (rhfOnChange as React.ChangeEventHandler<HTMLInputElement> | undefined);

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className={inputClassName}
        name={name}
        onBlur={rhfOnBlur}
        onChange={handleChange}
        ref={ref}
        {...(checked !== undefined ? { checked: checked } : {})}
        {...rest}
      />
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {error && <span className="ml-2 text-xs text-red-500">*</span>}
    </div>
  );
};

export default CheckboxField;
