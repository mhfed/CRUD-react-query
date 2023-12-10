import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IProduct } from '../type';
import { Link } from 'react-router-dom';

export const List = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await axios.delete(`http://localhost:3000/products/${id}`);
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
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const res = await axios.get('http://localhost:3000/products');
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  const handleRemove = (id: number) => () => {
    if (window.confirm('Are you sure?')) {
      mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <table className='table table-bordered'>
      <thead>
        <tr>
          <th scope='col'>#</th>
          <th scope='col'>Name</th>
          <th scope='col'>Price</th>
          <th scope='col'>
            <Link to={'/products/add'}>
              <button className='btn btn-primary'>Add</button>
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.map((product: IProduct) => (
          <tr key={product.id}>
            <th scope='row'>{product.id}</th>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>
              <Link to={`/products/${product.id}`}>
                <button className='btn btn-warning'>Edit</button>
              </Link>
              <button
                className='btn btn-danger ms-2'
                onClick={handleRemove(product.id!)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
