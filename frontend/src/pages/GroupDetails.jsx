import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getGroupDetailsApi,
  getExpensesApi,
} from "../api/expenseApi";

import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import AddExpenseForm from "../components/AddExpenseForm";
import AddMemberForm from "../components/AddMemberForm";

const GroupDetails = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchGroup = async () => {
    try {
      const res = await getGroupDetailsApi(id);
      setGroup(res.data.group);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await getExpensesApi(id);
      setExpenses(res.data.expenses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
  }, []);

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500 font-medium animate-pulse">
          Loading group details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {group.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage expenses and members for this group.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/group/${id}/summary`}
              className="inline-flex justify-center items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              View Summary
            </Link>
            <Link
              to={`/group/${id}/settlements`}
              className="inline-flex justify-center items-center px-4 py-2 bg-gray-900 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              View Settlements
            </Link>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Members & Add Member */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Group Members ({group.members?.length || 0})
              </h2>
              
              <ul className="space-y-3 mb-6">
                {group.members.map((member) => (
                  <li key={member._id} className="flex items-center gap-3">
                    {/* Minimalist Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 border border-gray-200">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {member.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Add Member Form isolated visually by a top border */}
              <div className="pt-5 border-t border-gray-100">
                <AddMemberForm
                  groupId={id}
                  refreshGroup={fetchGroup}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Add Expense & Expense Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Add Expense Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Add New Expense
              </h2>
              <AddExpenseForm
                groupId={id}
                fetchExpenses={fetchExpenses}
                userId={user.id}
              />
            </div>

            {/* Expenses List */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Recent Expenses
              </h2>
              
              {expenses.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    No expenses yet. Add one above!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <ExpenseCard 
                      key={expense._id} 
                      expense={expense} 
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default GroupDetails;