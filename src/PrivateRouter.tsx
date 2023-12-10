import React from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouterProps = {
  children: React.ReactNode;
};

export const PrivateRouter = ({ children }: PrivateRouterProps) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  console.log({ user });
  if (!user || Object.keys(user).length === 0 || user?.user.id !== 1) {
    return <Navigate to='/signin' />;
  }
  return children;
};
