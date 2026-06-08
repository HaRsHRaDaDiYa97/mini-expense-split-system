const ExpenseCard = ({ expense }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      {/* Left Side: Description & Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          {expense.description}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500">
          {/* Payer Info */}
          <span className="font-medium text-gray-700 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Paid by {expense.paidBy?.name || "Unknown"}
          </span>
          
          {/* Visual Bullet Divider (Hidden on very small screens) */}
          <span className="hidden sm:inline-block text-gray-300">•</span>
          
          {/* Split Type Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 capitalize tracking-wide">
            {expense.splitType?.toLowerCase() || "Equal"} Split
          </span>
        </div>
      </div>

      {/* Right Side: Amount */}
      <div className="flex items-center sm:justify-end mt-1 sm:mt-0">
        <span className="text-lg font-bold text-gray-900 bg-gray-50 px-3.5 py-1.5 rounded-lg border border-gray-100">
          ₹{expense.amount}
        </span>
      </div>

    </div>
  );
};

export default ExpenseCard;