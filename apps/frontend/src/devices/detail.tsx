import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LayoutHeader } from '../components/LayoutHeader';
import { Column } from '../components/Column';
import { Card } from '../components/Card';
import { ErrorState } from '../components/AsyncUtils';
import { Deployment, Device } from '../../types';
import { DateTime } from '../components/DateTime';
import { Pill } from '../components/Pill';
import { toSentenceCase } from '../utils';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { DetailView } from '../components/DetailView';
import { DetailField } from '../components/DetailView';

const deviceDetailFields: DetailField<Device>[] = [
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
    accessor: (device: Device) => <DateTime date={device.createdAt} />
  },
  {
    label: 'Updated At',
    accessor: (device: Device) => <DateTime date={device.updatedAt} />
  },
  {
    label: 'Polling Time',
    accessor: 'pollingTime'
  },
  {
    label: 'State',
    accessor: (device: Device) => <Pill>{toSentenceCase(device.state)}</Pill>
  }
];

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
          <DetailView<Device>
            id={id}
            endpoint='/devices'
            queryKey='device'
            fields={deviceDetailFields}
          />
        </Card>
        <Card title='Deployments'>
          <AsyncTable<Deployment>
            queryKey={`device-${id}-deployments`}
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