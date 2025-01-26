import { Link } from 'react-router';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-zinc-50 w-screen h-screen text-zinc-800'>
      <div className='border-b border-zinc-300'>
        <div className='container mx-auto flex flex-row gap-4 p-2'>
          <Link className='flex' to='/'>Home</Link>
          <Link className='flex' to='/devices'>Devices</Link>
          <Link className='flex' to='/images'>Images</Link>
          <Link className='flex' to='/workspace'>Workspace</Link>
        </div>
      </div>
      <div className='container mx-auto'>
        {children}
      </div>
    </div>
  );
};