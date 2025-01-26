import { useForm, UseFormRegister, Path, FieldValues, RegisterOptions } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from './Button';
import { ErrorMessage, Input, Label } from './FormUtils';
import { BASE_API_URL } from '../consts';

export interface Field<T extends FieldValues> {
  name: Path<T>;
  label: string;
  validation?: RegisterOptions<T, Path<T>>;
  render?: (register: UseFormRegister<T>) => React.ReactNode;
}

interface CreateFormProps<T extends FieldValues> {
  endpoint: string;
  queryKey: string;
  fields: Field<T>[];
  onSuccess: () => void;
}

export const CreateForm = <T extends FieldValues>({ 
  endpoint,
  queryKey,
  fields,
  onSuccess
}: CreateFormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    mode: 'onChange'
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: T) => axios.post(BASE_API_URL + endpoint, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onSuccess();
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className='space-y-4'>
      {fields.map((field) => (
        <div key={field.name}>
          <Label>{field.label}</Label>
          {field.render ? (
            field.render(register)
          ) : (
            <Input
              {...register(field.name, field.validation)}
            />
          )}
          {errors[field.name] && (
            <ErrorMessage>{errors[field.name]?.message as string}</ErrorMessage>
          )}
        </div>
      ))}

      {mutation.isError && (
        <ErrorMessage>Error creating. Please try again.</ErrorMessage>
      )}

      <div className='flex justify-end gap-2'>
        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}; 