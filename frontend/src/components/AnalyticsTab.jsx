import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Award, DollarSign, AlertCircle } from "lucide-react";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#64748b"];

const AnalyticsTab = ({ expenses, group }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
        <AlertCircle className="w-10 h-10 text-gray-300 mb-3" />
        <h3 className="text-base font-bold text-gray-900 mb-1">No data available</h3>
        <p className="text-xs text-gray-400">Add some expenses to view insights and charts.</p>
      </div>
    );
  }

  // 1. Category Breakdown Data
  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: Number(value.toFixed(2)),
  }));

  // 2. Member Contribution Data (Total Paid)
  const memberMap = {};
  group.members.forEach((m) => {
    if (m.user) memberMap[m.user.name] = 0;
  });
  expenses.forEach((e) => {
    const name = e.paidBy?.name || "Unknown";
    memberMap[name] = (memberMap[name] || 0) + e.amount;
  });
  const memberData = Object.entries(memberMap).map(([name, value]) => ({
    name,
    amount: Number(value.toFixed(2)),
  }));

  // 3. Monthly Spend Data
  const monthlyMap = {};
  expenses.forEach((e) => {
    const date = new Date(e.createdAt);
    const month = date.toLocaleString("default", { month: "short", year: "2-digit" });
    monthlyMap[month] = (monthlyMap[month] || 0) + e.amount;
  });
  const monthlyData = Object.entries(monthlyMap)
    .map(([name, amount]) => ({ name, amount: Number(amount.toFixed(2)) }))
    .reverse(); // Chronological order

  // 4. Insights calculation
  let highestExpense = { amount: 0, description: "None" };
  const memberActivityMap = {};
  let highestCategoryName = "None";
  let maxCatAmount = 0;

  expenses.forEach((e) => {
    if (e.amount > highestExpense.amount) {
      highestExpense = e;
    }
    const payerName = e.paidBy?.name || "Unknown";
    memberActivityMap[payerName] = (memberActivityMap[payerName] || 0) + 1;
  });

  Object.entries(categoryMap).forEach(([cat, amt]) => {
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      highestCategoryName = cat;
    }
  });

  const mostActiveMemberName = Object.entries(memberActivityMap).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max),
    ["None", 0]
  )[0];

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Highest Expense</p>
            <h4 className="font-bold text-gray-900 text-sm truncate max-w-xs">{highestExpense.description}</h4>
            <span className="text-xs text-indigo-650 font-bold">₹{highestExpense.amount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Most Active Member</p>
            <h4 className="font-bold text-gray-900 text-sm truncate max-w-xs">{mostActiveMemberName}</h4>
            <span className="text-xs text-emerald-650 font-medium">Frequent Payer</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-650 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Spending Category</p>
            <h4 className="font-bold text-gray-900 text-sm capitalize truncate max-w-xs">{highestCategoryName}</h4>
            <span className="text-xs text-amber-650 font-bold">₹{maxCatAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly spend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Spending over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} stroke="#9ca3af" />
                <YAxis fontSize={11} tickLine={false} stroke="#9ca3af" />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member contribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Member Contributions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} stroke="#9ca3af" />
                <YAxis fontSize={11} tickLine={false} stroke="#9ca3af" />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="space-y-3">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="font-semibold text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsTab;
