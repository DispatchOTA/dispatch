import { Link } from 'react-router-dom';

interface TextLinkProps {
  to: string;
  children: React.ReactNode;
}

export const TextLink = ({ to, children }: TextLinkProps) => {
  return (
    <Link 
      to={to}
      className='text-blue-500 hover:text-blue-700 underline'
    >
      {children}
    </Link>
  );
};
