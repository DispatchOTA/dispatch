import { InputHTMLAttributes, forwardRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '../consts';
import { ErrorState, LoadingState } from '../components/AsyncUtils';
import { EmptyState } from '../components/AsyncUtils';
import { Image, ImageVersion, CreateDeploymentDto } from '../types';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';

export const ErrorMessage = ({children}: {children: React.ReactNode}) => {
  return <p className='text-red-500 text-sm mt-1'>{children}</p>;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    className='w-full p-2 border rounded focus:outline-none focus:ring-1'
    {...props}
  />
));

export const Select = forwardRef<HTMLSelectElement, InputHTMLAttributes<HTMLSelectElement>>((props, ref) => (
  <select
    ref={ref}
    className='w-full p-2 border rounded focus:outline-none focus:ring-1'
    {...props}
  />
));

export const Label = ({children}: {children: React.ReactNode}) => {
  return <label className='block text-sm font-medium mb-1'>{children}</label>;
}

export const ImageSelect = ({ register }: { register: UseFormRegister<CreateDeploymentDto> }) => {
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

export const VersionSelect = ({ register, watch }: { register: UseFormRegister<CreateDeploymentDto>, watch?: UseFormWatch<CreateDeploymentDto> }) => {
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
