import React from 'react';
import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-background z-50">
      {/* You can replace the Loader2 icon with any other loading animation you prefer */}
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};

export default Loading;