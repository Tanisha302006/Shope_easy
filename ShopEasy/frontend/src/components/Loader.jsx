import { Loader2 } from 'lucide-react';

const Loader = ({ className }) => {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );
};

export default Loader;
