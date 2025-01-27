import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LayoutHeader } from '../components/LayoutHeader';
import { Column } from '../components/Column';
import { Card } from '../components/Card';
import { ErrorState } from '../components/AsyncUtils';
import { DateTime } from '../components/DateTime';
import { DetailView } from '../components/DetailView';
import { DetailField } from '../components/DetailView';
import { Image, ImageVersion } from '../../types';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { CreateForm, Field } from '../components/CreateForm';
import { CreateDialog } from '../components/CreateDialog';
import { MAX_DESC_LEN } from '../consts';
import { MAX_ID_LEN } from '../consts';
import { MIN_ID_LEN } from '../consts';
import { UseFormRegister } from 'react-hook-form';


interface CreateImageVersionDto {
  id: string;
  description: string;
  file: FileList;
}

const imageVersionFields: Field<CreateImageVersionDto>[] = [
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
    render: (register: UseFormRegister<CreateImageVersionDto>) => (
      <input 
        type="file" 
        accept="image/*"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2"
        {...register('file')} 
      />
    )
  }
];

const imageDetailFields: DetailField<Image>[] = [
  {
    label: 'ID',
    accessor: 'id'
  },
  {
    label: 'Description',
    accessor: 'description'
  },
  {
    label: 'Created At',
    accessor: (image: Image) => <DateTime date={image.createdAt} />
  },
  {
    label: 'Updated At',
    accessor: (image: Image) => <DateTime date={image.updatedAt} />
  },
];

const imageVersionColumns: AsyncTableColumn<ImageVersion>[] = [
  {
    header: 'ID',
    accessor: 'id'
  },
  {
    header: 'Description',
    accessor: 'description'
  },
  {
    header: 'Created At',
    accessor: (imageVersion: ImageVersion) => <DateTime date={imageVersion.createdAt} />
  }
];

const ImageDetail = () => {
  const { id } = useParams();

  if (!id) return <ErrorState>No image id found</ErrorState>;

  return (
    <Layout>
      <LayoutHeader title='Image'>
        <CreateDialog 
          title="Create Image Version"
          cta="Create version"
          description="Create a new image version"
          >
            <CreateForm<CreateImageVersionDto>
              endpoint={`/images/${id}/versions`}
              queryKey={`image-${id}-versions`}
              fields={imageVersionFields}
              onSuccess={() => {}}
            />
          </CreateDialog>
      </LayoutHeader>
      <Column>
        <Card title='Detail'>
          <DetailView<Image>
            id={id}
            endpoint='/images'
            queryKey='image'
            fields={imageDetailFields}
          />
        </Card>
        <Card title='Versions'>
          <AsyncTable<ImageVersion>
            queryKey={`image-${id}-versions`}
            endpoint={`/images/${id}/versions`}
            columns={imageVersionColumns}
            emptyMessage='No versions found'
            errorMessage='Error loading versions'
          />
        </Card>
      </Column>
    </Layout>
  );
};

export default ImageDetail;