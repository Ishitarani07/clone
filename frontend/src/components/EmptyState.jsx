import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, description, actionText, actionLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-300 mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium hover:bg-blue-600 transition"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
