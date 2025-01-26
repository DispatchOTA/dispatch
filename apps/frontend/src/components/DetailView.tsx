import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '../consts';
import { LoadingState, ErrorState } from './AsyncUtils';
import { DetailPoint } from './DetailUtils';

export interface DetailField<T> {
  label: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DetailViewProps<T> {
  id: string;
  endpoint: string;
  queryKey: string;
  fields: DetailField<T>[];
}

export const DetailView = <T extends object>({ 
  id,
  endpoint,
  queryKey,
  fields
}: DetailViewProps<T>) => {
  const { data, isLoading, isError } = useQuery<T>({
    queryKey: [queryKey, id],
    queryFn: () => axios.get(`${BASE_API_URL}${endpoint}/${id}`).then(res => res.data)
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState>Error fetching data</ErrorState>;
  if (!data) return <ErrorState>No data found</ErrorState>;

  return (
    <div className='grid grid-cols-2 gap-4'>
      {fields.map((field, index) => (
        <DetailPoint key={index} label={field.label}>
          {typeof field.accessor === 'function' 
            ? field.accessor(data)
            : (data[field.accessor] as React.ReactNode) || '-'}
        </DetailPoint>
      ))}
    </div>
  );
}; 