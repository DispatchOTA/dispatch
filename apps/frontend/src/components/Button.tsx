import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyles = 'px-2 py-1 rounded-md cursor-pointer';
  const variantStyles = variant === 'primary' 
    ? 'bg-green-500 border border-green-600 text-white' 
    : 'bg-gray-100 border border-gray-200 text-gray-900';
    
  return <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>{props.children}</button>
}