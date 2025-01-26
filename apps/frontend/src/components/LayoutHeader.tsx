interface LayoutHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const LayoutHeader = ({title, children}: LayoutHeaderProps) => {
  return (
    <div className='flex justify-between items-center my-8'>
      <h1 className='text-3xl font-bold'>{title}</h1>
      {children}
    </div>
  );
};