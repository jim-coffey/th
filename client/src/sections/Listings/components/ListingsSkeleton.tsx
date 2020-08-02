import React from 'react';
import { Alert, Skeleton, Divider } from 'antd';
import './styles/ListingsSkeleton.css';

interface Props {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton = ({ title, error = false }: Props) => {
  const errorAlert = error ? (
    <Alert type="error" message="Uh oh! Something went wrong!" />
  ) : null;

  return (
    <div className="listings-skeleton">
      <h2>{title}</h2>
      {errorAlert}
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  );
};
