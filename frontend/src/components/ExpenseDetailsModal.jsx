import React, { useState } from "react";
import { X, Trash2, Edit2, Calendar, User, Tag, Paperclip, Loader2, Sparkles } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";

const categories = ["food", "transport", "hotel", "shopping", "fuel", "entertainment", "other"];

const ExpenseDetailsModal = ({ expense, onClose, onRefresh, group, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit States
  const [description, setDescription] = useState(expense.description || "");
  const [amount, setAmount] = useState(expense.amount || 0);
  const [category, setCategory] = useState(expense.category || "other");
  const [splitType, setSplitType] = useState(expense.splitType || "equal");
  const [paidBy, setPaidBy] = useState(expense.paidBy?._id || expense.paidBy || "");
  const [attachmentUrl, setAttachmentUrl] = useState(expense.attachmentUrl || "");

  // Initialize splits mapping
  const [splits, setSplits] = useState(() => {
    const map = {};
    group.members.forEach((m) => {
      const uid = m.user?._id || m.user;
      const existing = expense.splitAmong?.find((s) => (s.user?._id || s.user)?.toString() === uid?.toString());
      map[uid] = {
        amount: existing ? existing.amount : 0,
        percentage: existing ? existing.percentage || 0 : 0,
        shares: existing ? existing.shares || 0 : 0,
      };
    });
    return map;
  });

  // Role verification helper
  const userMember = group.members.find((m) => (m.user?._id || m.user)?.toString() === currentUser.id);
  const canModify =
    userMember?.role === "owner" ||
    userMember?.role === "admin" ||
    (expense.paidBy?._id || expense.paidBy)?.toString() === currentUser.id;

  const handleSplitChange = (userId, field, val) => {
    setSplits({
      ...splits,
      [userId]: {
        ...splits[userId],
        [field]: Number(val),
      },
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploading(true);
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    // Build splitAmong array
    const splitAmong = Object.entries(splits).map(([userId, item]) => ({
      user: userId,
      amount: item.amount,
      percentage: item.percentage,
      shares: item.shares,
    }));

    try {
      setLoading(true);
      await api.put(`/expenses/${expense._id}`, {
        description: description.trim(),
        amount: Number(amount),
        category,
        splitType,
        paidBy,
        splitAmong,
        attachmentUrl,
      });

      toast.success("Expense updated successfully!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      setLoading(true);
      await api.delete(`/expenses/${expense._id}`);
      toast.success("Expense deleted successfully!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-extrabold text-gray-900 text-lg">
            {isEditing ? "Edit Expense" : "Expense Details"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Description & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Total Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Payer & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Paid By</label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white"
                  >
                    {group.members.map((m) => (
                      <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                        {m.user?.name || "User"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Split Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Split Mode</label>
                <select
                  value={splitType}
                  onChange={(e) => setSplitType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white"
                >
                  <option value="equal">Split Equally</option>
                  <option value="unequal">Split Unequally (Amounts)</option>
                  <option value="percentage">Split by Percentage (%)</option>
                  <option value="shares">Split by Shares</option>
                </select>
              </div>

              {/* Advanced Splits Grid */}
              {splitType !== "equal" && (
                <div className="bg-gray-50 rounded-2xl border border-gray-150 p-4 space-y-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Configure Splits
                  </span>
                  {group.members.map((m) => {
                    const uid = m.user?._id || m.user;
                    return (
                      <div key={uid} className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-700">{m.user?.name || "User"}</span>
                        <div className="w-32 flex-shrink-0">
                          {splitType === "unequal" && (
                            <input
                              type="number"
                              placeholder="Amount (₹)"
                              value={splits[uid]?.amount || ""}
                              onChange={(e) => handleSplitChange(uid, "amount", e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            />
                          )}
                          {splitType === "percentage" && (
                            <input
                              type="number"
                              placeholder="Percent (%)"
                              value={splits[uid]?.percentage || ""}
                              onChange={(e) => handleSplitChange(uid, "percentage", e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            />
                          )}
                          {splitType === "shares" && (
                            <input
                              type="number"
                              placeholder="Shares"
                              value={splits[uid]?.shares || ""}
                              onChange={(e) => handleSplitChange(uid, "shares", e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload Receipt */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Attachment / Receipt Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="receipt-edit"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <label
                    htmlFor="receipt-edit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-750 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload Receipt"}
                  </label>
                  {attachmentUrl && (
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 font-semibold hover:underline truncate max-w-xs"
                    >
                      View Attached file
                    </a>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-550 hover:text-gray-800 focus:outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm focus:outline-none cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Summary details */}
              <div className="bg-gray-50 rounded-2xl border border-gray-150 p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{expense.description}</h3>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-2 border-indigo-100 bg-indigo-50 text-indigo-700 capitalize tracking-wide">
                      <Tag className="w-3 h-3" />
                      {expense.category}
                    </div>
                  </div>
                  <span className="text-2xl font-black text-gray-900">
                    ₹{expense.amount}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-150 text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Paid by <strong>{expense.paidBy?.name || "Unknown"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Split breakdown */}
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Split Details ({expense.splitType} split)
                </span>
                <ul className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                  {expense.splitAmong?.map((split, i) => (
                    <li key={i} className="px-5 py-3.5 flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">{split.user?.name || "Deleted User"}</span>
                      <span className="font-bold text-gray-900">₹{split.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachment Display */}
              {expense.attachmentUrl && (
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Receipt Attachment
                  </span>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden p-2 bg-gray-50 flex flex-col items-center justify-center">
                    <img
                      src={expense.attachmentUrl}
                      alt="receipt"
                      className="max-h-48 object-contain rounded-lg shadow-sm"
                    />
                    <a
                      href={expense.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 font-bold hover:underline mt-2 flex items-center gap-1"
                    >
                      Open receipt in new tab
                    </a>
                  </div>
                </div>
              )}

              {/* Modify Actions */}
              {canModify && (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-red-650 hover:text-red-750 text-sm font-semibold focus:outline-none cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Expense
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Expense
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
