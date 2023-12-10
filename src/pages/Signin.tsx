import { ErrorMessage } from '@hookform/error-message';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation } from '@tanstack/react-query';
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

export const Signin = () => {
  const navigate = useNavigate();

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
        const res = await axios.post('http://localhost:3000/login', data);
        return res.data;
      } catch (error) {
        console.log('error', error);
        throw error;
      }
    },
    onSuccess: (data: any) => {
      localStorage.setItem('user', JSON.stringify(data));
      reset();
      toast.success('Signin successfully');

      setTimeout(() => {
        navigate('/products');
      }, 1000);
    },
  });

  const onSubmit: SubmitHandler<IForm> = (data: IForm) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign In Form</h2>
      <div className='mb-3'>
        <label htmlFor='email' className='form-label'>
          Email
        </label>
        <input
          {...register('email')}
          type='email'
          className='form-control'
          id='email'
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
        Signin
      </button>
    </form>
  );
};
