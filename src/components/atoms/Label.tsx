'use client';
import React from 'react';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label {...props}>{children}</label>
);

export default Label;
