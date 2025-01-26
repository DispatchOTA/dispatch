import { Layout } from '../components/Layout';
import { toSentenceCase } from '../utils';
import { Pill } from '../components/Pill';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { DateTime } from '../components/DateTime';
// import * as Dialog from '@radix-ui/react-dialog';
import { Dialog } from 'radix-ui';
import { DialogOverlay, DialogDescription, DialogTitle } from '../components/Dialog';
import { Button } from '../components/Button';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface CreateDeviceDto {
  id: string;
  description: string;
}

const CreateDeviceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateDeviceDto>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateDeviceDto) => 
      axios.post('http://localhost:3000/devices', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      onSuccess();
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-1'>ID</label>
        <input
          {...register('id', { required: 'ID is required' })}
          className='w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2'
        />
        {errors.id && (
          <p className='text-red-500 text-sm mt-1'>{errors.id.message}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <input
          {...register('description', { required: 'Description is required' })}
          className='w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2'
        />
        {errors.description && (
          <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className='text-red-500 text-sm'>Error creating device. Please try again.</p>
      )}

      <div className='flex justify-end gap-2'>
        <Dialog.Close asChild>
          <Button variant='secondary'>Cancel</Button>
        </Dialog.Close>
        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

const CreateDevice = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Create</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg'>
          <DialogTitle>Create Device</DialogTitle>
          <DialogDescription>Create a new device</DialogDescription>
          <CreateDeviceForm onSuccess={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface Device {
  uuid: string;
  id: string;
  description: string;
  state: string;
  pollingTime: string;
  createdAt: string;
  updatedAt: string;
}

const deviceColumns: AsyncTableColumn<Device>[] = [
  {
    header: 'ID',
    accessor: 'id'
  },
  {
    header: 'Description',
    accessor: 'description'
  },
  { 
    header: 'State', 
    accessor: (device) => <Pill>{toSentenceCase(device.state)}</Pill>
  },
  {
    header: 'Polling Time',
    accessor: 'pollingTime'
  },
  { 
    header: 'Created', 
    accessor: (device) => <DateTime date={device.createdAt} />
  },
];

const Page = () => {
  return (
    <Layout>
      <div className='flex justify-between items-center my-8'>
        <h1 className='text-3xl font-bold'>Devices</h1>
        <CreateDevice />
      </div>
      <AsyncTable
        queryKey='devices'
        endpoint='/devices'
        columns={deviceColumns}
        emptyMessage='No devices found'
        errorMessage='Error loading devices'
      />
    </Layout>
  )
}

export default Page;