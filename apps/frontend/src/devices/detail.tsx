import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';

const DeviceDetail = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className='my-8'>
        <h1 className='text-3xl font-bold'>Device: {id}</h1>
      </div>
    </Layout>
  );
};

export default DeviceDetail;