import { Link } from "react-router-dom";

const GroupCard = ({ group }) => {
  return (
    <Link
      to={`/group/${group._id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
    >
      {/* Header/Title */}
      <div className="flex justify-between items-start mb-5">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors line-clamp-1">
          {group.name}
        </h2>
        
        {/* Navigation Indicator Arrow */}
        <span className="text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      {/* Member Count Pill */}
      <div className="flex items-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {group.members?.length || 0} {group.members?.length === 1 ? "Member" : "Members"}
        </span>
      </div>
    </Link>
  );
};

export default GroupCard;