import React from "react";
import { FolderOpen, Users, Receipt, ShieldCheck } from "lucide-react";

const icons = {
  groups: FolderOpen,
  members: Users,
  expenses: Receipt,
  settlements: ShieldCheck,
};

const EmptyState = ({ type = "groups", title, description, actionText, onAction }) => {
  const Icon = icons[type] || FolderOpen;

  return (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm">
      <div className="w-14 h-14 bg-gray-55 text-gray-400 rounded-full flex items-center justify-center mb-5 border border-gray-100">
        <Icon className="w-7 h-7 text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {title || `No ${type} found`}
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        {description || `It looks like you don't have any ${type} recorded yet.`}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-gray-900 border border-transparent rounded-xl text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
