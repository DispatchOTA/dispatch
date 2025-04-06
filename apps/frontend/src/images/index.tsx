import { Layout } from '../components/Layout';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { DateTime } from '../components/DateTime';
import { CreateDialog } from '../components/CreateDialog';
import { CreateForm, Field } from '../components/CreateForm';
import { UseFormRegister } from 'react-hook-form';
import { MAX_DESC_LEN, MAX_ID_LEN } from '../consts';
import { MIN_ID_LEN } from '../consts';
import { LayoutHeader } from '../components/LayoutHeader';
import { Image } from '../types';
import { CreateImageDto } from '../types';

const imageFields: Field<CreateImageDto>[] = [
  {
    name: 'id',
    label: 'ID',
    validation: { 
      required: 'ID is required',
      minLength: { value: MIN_ID_LEN, message: `ID must be at least ${MIN_ID_LEN} characters` },
      maxLength: { value: MAX_ID_LEN, message: `ID must be at most ${MAX_ID_LEN} characters` }
    }
  },
  {
    name: 'description',
    label: 'Description (optional)',
    validation: { 
      maxLength: { value: MAX_DESC_LEN, message: `Description must be at most ${MAX_DESC_LEN} characters` }
    }
  },
  {
    name: 'file',
    label: 'File',
    validation: { required: 'File is required' },
    render: (register: UseFormRegister<CreateImageDto>) => (
      <input 
        type="file" 
        accept="image/*"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2"
        {...register('file')} 
      />
    )
  }
];

const imageColumns: AsyncTableColumn<Image>[] = [
  {
    header: 'ID',
    accessor: 'id'
  },
  {
    header: 'Description',
    accessor: 'description'
  },
  { 
    header: 'Versions', 
    accessor: (image) => image.versions.length
  },
  { 
    header: 'Created', 
    accessor: (image) => <DateTime date={image.createdAt} />
  },
];

const Page = () => {
  return (
    <Layout>
      <LayoutHeader title='Images'>
        <CreateDialog 
          title="Create Image"
          cta="Create image"
          description="Create a new image"
        >
          <CreateForm<CreateImageDto>
            endpoint="/images"
            queryKey="images"
            fields={imageFields}
            onSuccess={() => {}}
          />
        </CreateDialog>
      </LayoutHeader>
      <AsyncTable<Image>
        queryKey='images'
        endpoint='/images'
        columns={imageColumns}
        emptyMessage='No images found'
        errorMessage='Error loading images'
        getRowHref={(image) => `/images/${image.uuid}`}
      />
    </Layout>
  )
}

export default Page;