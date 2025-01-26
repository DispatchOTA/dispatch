import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '../consts';
import { useNavigate } from 'react-router-dom';
import { LoadingState, ErrorState, EmptyState } from './AsyncUtils';

export interface AsyncTableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface AsyncTableProps<T> {
  queryKey: string;
  endpoint: string;
  columns: AsyncTableColumn<T>[];
  emptyMessage: string;
  errorMessage: string;
  getRowHref?: (item: T) => string;
}

const TableColumn = ({children}: {children: React.ReactNode}) => {
  return <td className='py-4 px-4'>{children}</td>
}

const TableHeader = ({children}: {children: React.ReactNode}) => {
  return <th className='py-3 px-4 text-left text-sm font-semibold text-zinc-900'>{children}</th>
}

export const AsyncTable = <T extends { uuid: string }>({ 
  queryKey,
  endpoint,
  columns,
  emptyMessage = 'No items found',
  errorMessage = 'Error loading data',
  getRowHref
}: AsyncTableProps<T>) => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => axios.get(BASE_API_URL + endpoint).then(res => res.data)
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState>{errorMessage}</ErrorState>;
  if (!data?.length) return <EmptyState>{emptyMessage}</EmptyState>;

  return (
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className='bg-gray-50'>
        <tr>
          {columns.map((column, index) => (
            <TableHeader key={index}>{column.header}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {data?.map((item: T) => (
          <tr 
            key={item.uuid}
            onClick={() => getRowHref && navigate(getRowHref(item))}
            className={getRowHref ? 'cursor-pointer hover:bg-gray-100' : ''}
          >
            {columns.map((column, index) => (
              <TableColumn key={index}>
                {typeof column.accessor === 'function' 
                  ? column.accessor(item)
                  : (item[column.accessor] as React.ReactNode) || '-'}
              </TableColumn>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
