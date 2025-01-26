import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../utils';

export interface AsyncTableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

export interface AsyncTableProps<T> {
  queryKey: string;
  endpoint: string;
  columns: AsyncTableColumn<T>[];
  emptyMessage?: string;
  errorMessage?: string;
}

const AsyncLoadingState = () => {
  return <div>Loading...</div>;
}

const AsyncErrorState = ({children}: {children: React.ReactNode}) => {
  return <div className='text-red-500'>{children}</div>;
}

const AsyncEmptyState = ({children}: {children: React.ReactNode}) => {
  return <div>{children}</div>;
}

const TableColumn = ({children}: {children: React.ReactNode}) => {
  return <td className='py-4 px-4'>{children}</td>
}

const TableHeader = ({children}: {children: React.ReactNode}) => {
  return <th className='py-3 px-4 text-left text-sm font-semibold text-zinc-900'>{children}</th>
}

export const AsyncTable = <T extends { uuid: string } & Record<keyof T, React.ReactNode>>({ 
  queryKey,
  endpoint,
  columns,
  emptyMessage = 'No items found',
  errorMessage = 'Error loading data'
}: AsyncTableProps<T>) => {
  const { data: items, isLoading, error } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchData<T>(endpoint),
  });

  if (isLoading) {
    return <AsyncLoadingState />
  }

  if (error) {
    return <AsyncErrorState>{errorMessage}</AsyncErrorState>
  }

  if (items?.length === 0) {
    return <AsyncEmptyState>{emptyMessage}</AsyncEmptyState>
  }

  return (
    <table className='min-w-full bg-white rounded'>
      <thead className='border-b border-zinc-200'>
        <tr>
          {columns.map((column, index) => (
            <TableHeader key={index}>{column.header}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {items?.map((item) => (
          <tr key={item.uuid} className='border-b border-zinc-200'>
            {columns.map((column, index) => (
              <TableColumn key={index}>
                {typeof column.accessor === 'function' 
                  ? column.accessor(item)
                  : item[column.accessor]}
              </TableColumn>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
