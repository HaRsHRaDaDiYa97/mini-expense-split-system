import { Link } from "react-router-dom";
import { Users, Compass, Users2, Briefcase, Calendar, Folder } from "lucide-react";

const categoryIcons = {
  trip: Compass,
  friends: Users2,
  family: Users,
  office: Briefcase,
  event: Calendar,
  other: Folder,
};

const categoryColors = {
  trip: "bg-blue-50 text-blue-700 border-blue-100",
  friends: "bg-purple-50 text-purple-700 border-purple-100",
  family: "bg-pink-50 text-pink-700 border-pink-100",
  office: "bg-amber-50 text-amber-700 border-amber-100",
  event: "bg-emerald-50 text-emerald-700 border-emerald-100",
  other: "bg-gray-50 text-gray-700 border-gray-155",
};

const getAvatarColor = (name) => {
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-teal-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const GroupCard = ({ group }) => {
  const Icon = categoryIcons[group.category] || Folder;
  const badgeColor = categoryColors[group.category] || categoryColors.other;
  const avatarColor = getAvatarColor(group.name);

  return (
    <Link
      to={`/group/${group._id}`}
      className={`block bg-white rounded-2xl border ${
        group.isArchived ? "border-gray-200 opacity-70" : "border-gray-100 hover:border-gray-200"
      } p-6 shadow-sm hover:shadow-md transition-all duration-200 group relative`}
    >
      <div className="flex gap-4 items-start mb-4">
        {/* Generated Avatar */}
        <div className={`w-12 h-12 rounded-xl ${avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0`}>
          {group.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 justify-between">
            <h2 className="text-base font-bold text-gray-900 group-hover:text-gray-750 transition-colors truncate">
              {group.name}
            </h2>
            {group.isArchived && (
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full uppercase">
                Archived
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {group.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Footer Badges */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${badgeColor}`}>
          <Icon className="w-3 h-3" />
          <span className="capitalize">{group.category}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-550">
          <Users className="w-3.5 h-3.5" />
          {group.members?.length || 0} {group.members?.length === 1 ? "member" : "members"}
        </span>
      </div>
    </Link>
  );
};

export default GroupCard;