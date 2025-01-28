import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LayoutHeader } from '../components/LayoutHeader';
import { Column } from '../components/Column';
import { Card } from '../components/Card';
import { ErrorState } from '../components/AsyncUtils';
import { Deployment, Device, Image, ImageVersion } from '../../types';
import { DateTime } from '../components/DateTime';
import { Pill } from '../components/Pill';
import { toSentenceCase } from '../utils';
import { AsyncTable, AsyncTableColumn } from '../components/AsyncTable';
import { DetailView } from '../components/DetailView';
import { DetailField } from '../components/DetailView';
import { CreateForm, Field } from '../components/CreateForm';
import { CreateDialog } from '../components/CreateDialog';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '../consts';
import { LoadingState } from '../components/AsyncUtils';
import { EmptyState } from '../components/AsyncUtils';
import { Select } from '../components/FormUtils';

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

interface CreateDeploymentDto {
  deviceId: string;
  imageId: string;
  imageVersionId: string;
}



const ImageSelect = ({ register }: { register: UseFormRegister<CreateDeploymentDto> }) => {
  const { data: images, isLoading, isError } = useQuery({
    queryKey: ['images'],
    queryFn: () => axios.get(`${BASE_API_URL}/images`).then(res => res.data)
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState>Error loading images</ErrorState>;
  if (!images?.length) return <EmptyState>No images found</EmptyState>;

  return (
    <Select {...register('imageId')}>
      <option value=''>Select an image</option>
      {images.map((image: Image) => (
        <option key={image.uuid} value={image.uuid}>
          {image.id}
        </option>
      ))}
    </Select>
  );
};

const VersionSelect = ({ register, watch }: { register: UseFormRegister<CreateDeploymentDto>, watch?: UseFormWatch<CreateDeploymentDto> }) => {
  const selectedImageId = watch ? watch('imageId') : '';

  const { data: versions, isLoading, isError } = useQuery({
    queryKey: ['image', selectedImageId, 'versions'],
    queryFn: () => axios.get(`${BASE_API_URL}/images/${selectedImageId}/versions`).then(res => res.data),
    enabled: !!selectedImageId
  });

  if (!selectedImageId) return <EmptyState>Select an image first</EmptyState>;
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState>Error loading versions</ErrorState>;
  if (!versions?.length) return <EmptyState>No versions available</EmptyState>;

  return (
    <Select {...register('imageVersionId')}>
      <option value=''>Select a version</option>
      {versions.map((version: ImageVersion) => (
        <option key={version.uuid} value={version.uuid}>
          {version.id}
        </option>
      ))}
    </Select>
  );
};

const deploymentFields: Field<CreateDeploymentDto>[] = [
  {
    name: 'imageId',
    label: 'Image',
    validation: { required: 'Image is required' },
    render: (register: UseFormRegister<CreateDeploymentDto>) => (
      <ImageSelect register={register} />
    )
  },
  {
    name: 'imageVersionId',
    label: 'Version',
    validation: { required: 'Version is required' },
    render: (register: UseFormRegister<CreateDeploymentDto>, watch?: UseFormWatch<CreateDeploymentDto>) => 
      watch ? <VersionSelect register={register} watch={watch} /> : null
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
      <LayoutHeader title='Device'>
        <CreateDialog
          title="Deploy to device"
          cta="Deploy"
          description="Deploy a new image version to the device"
          >
            <CreateForm<CreateDeploymentDto>
              endpoint={`/devices/${id}/deployments`}
              queryKey={`device-${id}-deployments`}
              fields={deploymentFields}
              onSuccess={() => {}}
            />
          </CreateDialog>
      </LayoutHeader>
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