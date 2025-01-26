export const Card = ({title, children}: {title: string, children: React.ReactNode}) => {
  return (
    <div className='bg-white p-4 rounded border border-zinc-200'>
      <h2 className='text-xl font-bold mb-4'>{title}</h2>
      {children}
    </div>
  );
};