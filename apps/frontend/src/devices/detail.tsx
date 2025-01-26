import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LayoutHeader } from '../components/LayoutHeader';
import { Column } from '../components/Column';
import { Card } from '../components/Card';
import { LoadingState, ErrorState } from '../components/AsyncUtils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '../consts';
import { Device } from '../../types';
import { DateTime } from '../components/DateTime';
import { Pill } from '../components/Pill';
import { toSentenceCase } from '../utils';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';

const DetailPoint = ({label, children}: {label: string, children: React.ReactNode}) => {
  return (
    <div className='flex items-start flex-col gap-1'>
      <p className='text-sm font-medium uppercase text-zinc-500'>{label}</p>
      {children}
    </div>
  );
};

const Detail = ({id}: {id: string}) => {
  const { data, isLoading, isError } = useQuery<Device>({
    queryKey: ['device', id],
    queryFn: () => axios.get(BASE_API_URL + '/devices/' + id).then(res => res.data)
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState>Error fetching device</ErrorState>;
  if (!data) return <ErrorState>No device found</ErrorState>;

  return (
    <div className='grid grid-cols-2 gap-4'>
      <DetailPoint label='ID'>
        <p>{data.id}</p>
      </DetailPoint>
      <DetailPoint label='Description'>
        <p>{data.description}</p>
      </DetailPoint>
      <DetailPoint label='Created At'>
        <DateTime date={data.createdAt} />
      </DetailPoint>
      <DetailPoint label='Updated At'>
        <DateTime date={data.updatedAt} />
      </DetailPoint>
      <DetailPoint label='Polling Time'>
        <p>{data.pollingTime}</p>
      </DetailPoint>
      <DetailPoint label='State'>
        <Pill>{toSentenceCase(data.state)}</Pill>
      </DetailPoint>
    </div>
  );
}

interface Deployment {
  uuid: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
  imageVersionId: string;
}

const deploymentColumns: AsyncTableColumn<Deployment>[] = [
  { 
    header: 'State', 
    accessor: (deployment) => <Pill>{toSentenceCase(deployment.state)}</Pill>
  },
  {
    header: 'Created',
    accessor: (deployment) => <DateTime date={deployment.createdAt} />
  },
];

const DeviceDetail = () => {
  const { id } = useParams();

  if (!id) return <ErrorState>No device id found</ErrorState>;

  return (
    <Layout>
      <LayoutHeader title='Device' />
      <Column>
        <Card title='Detail'>
          <Detail id={id} />
        </Card>
        <Card title='Deployments'>
            <AsyncTable<Deployment>
              queryKey={['device', id, 'deployments']}
              endpoint={`/devices/${id}/deployments`}
              columns={deploymentColumns}
              emptyMessage='No deployments found'
              errorMessage='Error loading deployments'
            />
        </Card>
      </Column>
    </Layout>
  );
};

export default DeviceDetail;