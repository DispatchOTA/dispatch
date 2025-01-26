interface DetailPointProps {
  label: string;
  children: React.ReactNode;
}

export const DetailPoint = ({label, children}: DetailPointProps) => {
  return (
    <div className='flex items-start flex-col gap-1'>
      <p className='text-sm font-medium uppercase text-zinc-500'>{label}</p>
      {children}
    </div>
  );
};