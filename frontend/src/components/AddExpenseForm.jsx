import { useState } from "react";
import { addExpenseApi } from "../api/expenseApi";
import { toast } from "sonner";
import api from "../api/axios";
import { Paperclip, Loader2, Plus } from "lucide-react";
import { compressImage } from "../utils/compressor";

const categories = ["food", "transport", "hotel", "shopping", "fuel", "entertainment", "other"];

const AddExpenseForm = ({ groupId, fetchExpenses, userId, group }) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "other",
    splitType: "equal",
  });
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  // Split details mapping by userId: { [userId]: { amount, percentage, shares } }
  const [splits, setSplits] = useState(() => {
    const map = {};
    group.members?.forEach((m) => {
      const id = m.user?._id || m.user;
      if (id) {
        map[id] = { amount: 0, percentage: 0, shares: 0 };
      }
    });
    return map;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSplitChange = (memberId, field, val) => {
    setSplits({
      ...splits,
      [memberId]: {
        ...splits[memberId],
        [field]: Number(val),
      },
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const compressedFile = await compressImage(file);
      const data = new FormData();
      data.append("file", compressedFile);

      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAttachmentUrl(res.data.url);
      toast.success("Receipt uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.description.trim()) return;

    // Build splits structure
    const splitAmong = Object.entries(splits).map(([mId, val]) => ({
      user: mId,
      amount: val.amount,
      percentage: val.percentage,
      shares: val.shares,
    }));

    try {
      setLoading(true);
      await addExpenseApi(groupId, {
        paidBy: userId,
        amount: Number(formData.amount),
        description: formData.description.trim(),
        splitType: formData.splitType,
        category: formData.category,
        splitAmong,
        attachmentUrl,
      });

      toast.success("Expense Added Successfully");

      setFormData({
        amount: "",
        description: "",
        category: "other",
        splitType: "equal",
      });
      setAttachmentUrl("");
      // Reset splits input
      const reset = {};
      group.members?.forEach((m) => {
        const id = m.user?._id || m.user;
        if (id) reset[id] = { amount: 0, percentage: 0, shares: 0 };
      });
      setSplits(reset);

      fetchExpenses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Description & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="exp-desc" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Description
          </label>
          <input
            id="exp-desc"
            type="text"
            name="description"
            placeholder="e.g. Dinner, Uber, Tickets"
            value={formData.description}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="exp-amount" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Total Amount (₹)
          </label>
          <input
            id="exp-amount"
            type="number"
            name="amount"
            min="1"
            step="any"
            placeholder="0.00"
            value={formData.amount}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Category & Split Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="exp-cat" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Category
          </label>
          <select
            id="exp-cat"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="exp-split" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Split Mode
          </label>
          <select
            id="exp-split"
            name="splitType"
            value={formData.splitType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white"
          >
            <option value="equal">Split Equally</option>
            <option value="unequal">Split Unequally (Amounts)</option>
            <option value="percentage">Split by Percentage (%)</option>
            <option value="shares">Split by Shares</option>
          </select>
        </div>
      </div>

      {/* Advanced Split Inputs Grid */}
      {formData.splitType !== "equal" && (
        <div className="p-4 bg-gray-55 rounded-2xl border border-gray-150 space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Split Breakdown Details
          </span>
          {group.members?.map((m) => {
            const mId = m.user?._id || m.user;
            return (
              <div key={mId} className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-gray-700">{m.user?.name || "User"}</span>
                <div className="w-32 flex-shrink-0">
                  {formData.splitType === "unequal" && (
                    <input
                      type="number"
                      placeholder="Amount (₹)"
                      value={splits[mId]?.amount || ""}
                      onChange={(e) => handleSplitChange(mId, "amount", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  )}
                  {formData.splitType === "percentage" && (
                    <input
                      type="number"
                      placeholder="Percent (%)"
                      value={splits[mId]?.percentage || ""}
                      onChange={(e) => handleSplitChange(mId, "percentage", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  )}
                  {formData.splitType === "shares" && (
                    <input
                      type="number"
                      placeholder="Shares"
                      value={splits[mId]?.shares || ""}
                      onChange={(e) => handleSplitChange(mId, "shares", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* File Receipt Attachment */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Receipt Attachment (Optional)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="receipt-file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,application/pdf"
          />
          <label
            htmlFor="receipt-file"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-55 transition-colors shadow-sm cursor-pointer"
          >
            <Paperclip className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload Receipt"}
          </label>
          {attachmentUrl && (
            <span className="text-xs text-emerald-600 font-semibold truncate max-w-xs">
              ✓ Attached successfully!
            </span>
          )}
        </div>
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding Expense...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add Expense
          </>
        )}
      </button>

    </form>
  );
};

export default AddExpenseForm;