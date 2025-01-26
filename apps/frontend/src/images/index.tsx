import { Layout } from '../components/Layout';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { DateTime } from '../components/DateTime';

interface Image {
  uuid: string;
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

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
    header: 'Created', 
    accessor: (image) => <DateTime date={image.createdAt} />
  },
];

const Page = () => {
  return (
    <Layout>
      <h1 className='text-3xl font-bold my-4'>Images</h1>
      <AsyncTable
        queryKey='images'
        endpoint='/images'
        columns={imageColumns}
        emptyMessage='No images found'
        errorMessage='Error loading images'
      />
    </Layout>
  )
}

export default Page;