import { Dialog } from 'radix-ui';
import { Button } from './Button';
import { useState } from 'react';

interface CreateDialogProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const CreateDialog = ({ title, description, children }: CreateDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Create</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg outline-none'>
          <Dialog.Title className="text-lg font-medium mb-2">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">{description}</Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 