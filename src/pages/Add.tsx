import { ErrorMessage } from '@hookform/error-message';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Joi from 'joi';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../type';

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  price: Joi.number().required(),
});

export const Add = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: joiResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: async (dataForm: IProduct) => {
      try {
        const res = await axios.post(
          'http://localhost:3000/products',
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
      toast.success('Add product success');
      setTimeout(() => {
        navigate('/products');
      }, 1000);
      reset();
    },
  });

  const onSubmit: SubmitHandler<IProduct> = (data: IProduct) => {
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Product Name
        </label>
        <input
          type='text'
          className='form-control'
          id='name'
          {...register('name')}
        />
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
        <input
          type='number'
          className='form-control'
          id='price'
          {...register('price')}
        />
        <ErrorMessage
          errors={errors}
          name='price'
          render={({ message }) => <p className='text-danger'>{message}</p>}
        />
      </div>
      <button type='submit' className='btn btn-primary'>
        Add
      </button>
    </form>
  );
};
