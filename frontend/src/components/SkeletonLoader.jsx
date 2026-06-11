import React from "react";

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
      <div className="w-20 h-5 rounded bg-gray-200"></div>
    </div>
    <div className="space-y-2">
      <div className="w-2/3 h-5 rounded bg-gray-200"></div>
      <div className="w-full h-4 rounded bg-gray-100"></div>
    </div>
    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
      <div className="w-1/3 h-4 rounded bg-gray-100"></div>
      <div className="w-1/4 h-4 rounded bg-gray-150"></div>
    </div>
  </div>
);

export const ExpenseSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-250 p-5 shadow-sm flex justify-between items-center animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
      <div className="space-y-2">
        <div className="w-32 h-5 rounded bg-gray-200"></div>
        <div className="w-24 h-4 rounded bg-gray-100"></div>
      </div>
    </div>
    <div className="space-y-2 text-right flex flex-col items-end">
      <div className="w-16 h-5 rounded bg-gray-200"></div>
      <div className="w-20 h-4 rounded bg-gray-100"></div>
    </div>
  </div>
);

export const SummarySkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((n) => (
      <div key={n} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="w-28 h-5 rounded bg-gray-200"></div>
        </div>
        <div className="space-y-2 flex flex-col items-end">
          <div className="w-16 h-5 rounded bg-gray-200"></div>
          <div className="w-12 h-4 rounded bg-gray-100"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SettlementSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((n) => (
      <div key={n} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 w-2/3">
          <div className="w-16 h-5 rounded bg-gray-200"></div>
          <div className="w-6 h-5 rounded bg-gray-100"></div>
          <div className="w-16 h-5 rounded bg-gray-200"></div>
        </div>
        <div className="w-16 h-6 rounded bg-gray-250"></div>
      </div>
    ))}
  </div>
);

const SkeletonLoader = ({ type = "card" }) => {
  if (type === "expense") return <ExpenseSkeleton />;
  if (type === "summary") return <SummarySkeleton />;
  if (type === "settlement") return <SettlementSkeleton />;
  return <CardSkeleton />;
};

export default SkeletonLoader;
