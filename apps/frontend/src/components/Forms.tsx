import { InputHTMLAttributes, forwardRef } from 'react';

export const ErrorMessage = ({children}: {children: React.ReactNode}) => {
  return <p className='text-red-500 text-sm mt-1'>{children}</p>;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    className='w-full p-2 border rounded focus:outline-none focus:ring-1'
    {...props}
  />
));

export const Label = ({children}: {children: React.ReactNode}) => {
  return <label className='block text-sm font-medium mb-1'>{children}</label>;
}