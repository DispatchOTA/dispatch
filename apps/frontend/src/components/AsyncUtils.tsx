export const LoadingState = () => {
  return <div>Loading...</div>;
}

export const ErrorState = ({children}: {children: React.ReactNode}) => {
  return <div className='text-red-500'>{children}</div>;
}

export const EmptyState = ({children}: {children: React.ReactNode}) => {
  return <div>{children}</div>;
}
