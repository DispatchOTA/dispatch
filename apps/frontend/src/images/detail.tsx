import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';

const ImageDetail = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className='my-8'>
        <h1 className='text-3xl font-bold'>Image: {id}</h1>
      </div>
    </Layout>
  );
};

export default ImageDetail;