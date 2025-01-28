import { Layout } from '../components/Layout';
import { toSentenceCase } from '../utils';
import { Pill } from '../components/Pill';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { DateTime } from '../components/DateTime';
import { CreateDialog } from '../components/CreateDialog';
import { CreateForm } from '../components/CreateForm';
import type { Field } from '../components/CreateForm';
import { MAX_DESC_LEN, MAX_ID_LEN, MIN_ID_LEN } from '../consts';
import { LayoutHeader } from '../components/LayoutHeader';
import { Device, CreateDeviceDto } from '../types';

const deviceFields: Field<CreateDeviceDto>[] = [
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
  }
];

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
      <LayoutHeader title='Devices'>
        <CreateDialog 
          title="Create Device"
          cta="Create device"
          description="Create a new device"
        >
          <CreateForm<CreateDeviceDto>
            endpoint="/devices"
            queryKey="devices"
            fields={deviceFields}
            onSuccess={() => {}}
          />
        </CreateDialog>
      </LayoutHeader>
      <AsyncTable<Device>
        queryKey='devices'
        endpoint='/devices'
        columns={deviceColumns}
        emptyMessage='No devices found'
        errorMessage='Error loading devices'
        getRowHref={(device) => `/devices/${device.uuid}`}
      />
    </Layout>
  )
}

export default Page;