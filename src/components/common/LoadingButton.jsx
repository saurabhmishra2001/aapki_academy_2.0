import React from 'react';
import { Button } from './Button';

const LoadingButton = ({ loading, children, className = '', ...props }) => {
  return (
    <Button disabled={loading} className={`relative ${className}`} {...props}>
      {loading ? <Spinner /> : children}
    </Button>
  );
};

const Spinner = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  </div>
);

export default LoadingButton;
