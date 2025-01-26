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
      <LayoutHeader title='Image' />
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