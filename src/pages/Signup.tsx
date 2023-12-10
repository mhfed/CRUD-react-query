import { ErrorMessage } from '@hookform/error-message';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Joi from 'joi';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type IForm = {
  email: string;
  password: string;
};

const schema = Joi.object({
  email: Joi.string().required().min(3),
  password: Joi.string().required(),
});

export const Signup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>({
    resolver: joiResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: IForm) => {
      try {
        const res = await axios.post('http://localhost:3000/register', data);
        return res.data;
      } catch (error) {
        console.log('error', error);
        throw error;
      }
    },
    onSuccess: () => {
      reset();
      toast.success('Sign up successfully');
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    },
  });

  const onSubmit: SubmitHandler<IForm> = (data: IForm) => {
    mutate(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign Up Form</h2>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Email
        </label>
        <input
          {...register('email')}
          type='email'
          className='form-control'
          id='name'
        />
        <ErrorMessage
          errors={errors}
          name='email'
          render={({ message }) => <p className='text-danger'>{message}</p>}
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          {...register('password')}
          type='password'
          className='form-control'
          id='password'
        />
        <ErrorMessage
          errors={errors}
          name='password'
          render={({ message }) => <p className='text-danger'>{message}</p>}
        />
      </div>
      <button type='submit' className='btn btn-primary'>
        Signup
      </button>
    </form>
  );
};
