import { Dialog } from 'radix-ui';

export const DialogOverlay = () => {
  return <Dialog.Overlay className='fixed inset-0 bg-black/20' />
}

export const DialogTitle = ({ children, ...props }: { children: React.ReactNode }) => {
  return <Dialog.Title className='text-xl font-bold mb-2' {...props}>{children}</Dialog.Title>
}

export const DialogDescription = ({ children, ...props }: { children: React.ReactNode }) => {
  return <Dialog.Description className='text-gray-600 mb-4' {...props}>{children}</Dialog.Description>
}