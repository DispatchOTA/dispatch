import { Layout } from '../components/Layout';
import { toSentenceCase } from '../utils';
import { Pill } from '../components/Pill';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';

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
    header: 'ID', accessor: 'id' },
  { header: 'Description', accessor: 'description' },
  { 
    header: 'State', 
    accessor: (device) => <Pill>{toSentenceCase(device.state)}</Pill>
  },
  { header: 'Polling Time', accessor: 'pollingTime' },
  { 
    header: 'Created', 
    accessor: (device) => new Date(device.createdAt).toLocaleDateString()
  },
];

const Devices = () => {
  return (
    <Layout>
      <h1 className='text-3xl font-bold my-4'>Devices</h1>
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

export default Devices;