import { useState } from "react";
import { addExpenseApi } from "../api/expenseApi";
import { toast } from "sonner";

const AddExpenseForm = ({ groupId, fetchExpenses, userId }) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if fields are essentially empty
    if (!formData.amount || !formData.description.trim()) return;

    try {
      await addExpenseApi(groupId, {
        paidBy: userId,
        amount: Number(formData.amount),
        description: formData.description.trim(),
        splitType: "equal",
      });

      toast.success("Expense Added Successfully");

      setFormData({
        amount: "",
        description: "",
      });

      fetchExpenses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add expense"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Inputs Container */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Description Input */}
        <div className="flex-grow">
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="What was this for? (e.g. Dinner, Uber)"
            value={formData.description}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Amount Input */}
        <div className="sm:w-40 flex-shrink-0">
          <label htmlFor="amount" className="sr-only">
            Amount
          </label>
          <div className="relative">
            {/* Currency Prefix */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm font-medium">₹</span>
            </div>
            <input
              id="amount"
              type="number"
              min="1"
              step="any"
              placeholder="0.00"
              value={formData.amount}
              required
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

      </div>

      {/* Submit Action */}
      <button
        type="submit"
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Add Expense
      </button>

    </form>
  );
};

export default AddExpenseForm;