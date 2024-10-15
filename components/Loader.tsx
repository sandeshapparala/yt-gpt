// components/Loader.tsx
import React from 'react';

const Loader = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="loader mb-4"></div>
      <span>{message}</span>
    </div>
  );
};

export default Loader;