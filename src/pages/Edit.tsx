import { ErrorMessage } from '@hookform/error-message';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Joi from 'joi';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { IProduct } from '../type';

const schema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().min(3).required(),
  price: Joi.number().required(),
});

export const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: joiResolver(schema),
  });

  console.log({ errors });
  const {
    data: oldData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:3000/products/${id}`);

        //reset form
        reset(res.data);

        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (dataForm: IProduct) => {
      try {
        const res = await axios.patch(
          `http://localhost:3000/products/${id}`,
          dataForm
        );
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      toast.success('Edit product success');
      setTimeout(() => {
        navigate('/products');
      }, 1000);
    },
  });

  const onSubmit: SubmitHandler<IProduct> = (newData: IProduct) => {
    console.log({ ...oldData, ...newData });
    mutate({ ...oldData, ...newData });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Product Name
        </label>
        <input type='text' className='form-control' {...register('name')} />
        <ErrorMessage
          errors={errors}
          name='name'
          render={({ message }) => <p className='text-danger'>{message}</p>}
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='price' className='form-label'>
          Product Price
        </label>
        <input type='number' className='form-control' {...register('price')} />
        <ErrorMessage
          errors={errors}
          name='price'
          render={({ message }) => <p className='text-danger'>{message}</p>}
        />
      </div>
      <button type='submit' className='btn btn-primary'>
        Update
      </button>
    </form>
  );
};
