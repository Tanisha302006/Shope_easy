import { AlertCircle } from 'lucide-react';

const EmptyState = ({ message, actionLink, actionText }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-medium text-slate-700 mb-2">{message || "Nothing to show here"}</h3>
      {actionLink && (
        <a href={actionLink} className="mt-4 text-blue-600 font-semibold hover:text-blue-700 hover:underline">
          {actionText || "Go Back"}
        </a>
      )}
    </div>
  );
};

export default EmptyState;
