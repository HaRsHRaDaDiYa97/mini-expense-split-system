import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Check, Paperclip, Loader2, ArrowRight, ShieldCheck, History, FileText } from "lucide-react";

const SettlementsTab = ({ group, currentUser, onRefreshDetails }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states for recording settlement
  const [showModal, setShowModal] = useState(false);
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sugRes, histRes] = await Promise.all([
        api.get(`/groups/${group._id}/settlements`),
        api.get(`/groups/${group._id}/settlements/history`),
      ]);
      setSuggestions(sugRes.data.settlements || []);
      setHistory(histRes.data.settlements || []);
    } catch (err) {
      console.error("Failed to load settlements:", err);
      toast.error("Failed to load settlements data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [group._id]);

  const handleOpenRecord = (fromId, toId, suggestAmt) => {
    setFromUser(fromId);
    setToUser(toId);
    setAmount(suggestAmt);
    setNotes("");
    setReceiptUrl("");
    setShowModal(true);
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
      setReceiptUrl(res.data.url);
      toast.success("Receipt uploaded successfully!");
    } catch (err) {
      toast.error("Receipt upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromUser || !toUser || !amount || Number(amount) <= 0) return;

    try {
      setSubmitting(true);
      await api.post(`/groups/${group._id}/settlements`, {
        from: fromUser,
        to: toUser,
        amount: Number(amount),
        notes: notes.trim(),
        receiptUrl,
      });

      toast.success("Settlement recorded successfully!");
      setShowModal(false);
      fetchData();
      if (onRefreshDetails) onRefreshDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record settlement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Suggestions Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Suggested Payments
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Recommended transactions to clear all group debts based on outstanding balances.
          </p>

          {loading ? (
            <div className="py-8 text-center text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-semibold">Everyone is squared up!</p>
              <p className="text-xs text-gray-400">No pending balances or settlements.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-bold text-gray-900">{sug.from.name}</span>
                    <ArrowRight className="w-4 h-4 mx-3 text-gray-400" />
                    <span className="font-bold text-gray-900">{sug.to.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                      ₹{sug.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleOpenRecord(sug.from.id, sug.to.id, sug.amount)}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History Feed Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-650" />
            Settlement Logs
          </h2>

          {loading ? (
            <div className="py-8 text-center text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No payments recorded yet.</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {history.map((log) => (
                <div key={log._id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-xs text-gray-700 font-medium">
                      <p>
                        <strong>{log.from?.name || "Deleted User"}</strong> paid{" "}
                        <strong>{log.to?.name || "Deleted User"}</strong>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      ₹{log.amount.toFixed(2)}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-[11px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-150">
                      "{log.notes}"
                    </p>
                  )}
                  {log.receiptUrl && (
                    <a
                      href={log.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-bold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Receipt
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-gray-100 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-gray-900 text-lg">Record Settlement</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Payer Field (Read-only for prepopulated suggestions) */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">From (Payer)</label>
                <select
                  disabled
                  value={fromUser}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                >
                  {group.members.map((m) => (
                    <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                      {m.user?.name || "User"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Field (Read-only) */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">To (Recipient)</label>
                <select
                  disabled
                  value={toUser}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                >
                  {group.members.map((m) => (
                    <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                      {m.user?.name || "User"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Field (Editable for partial settlement) */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sent via UPI, Cash"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent"
                />
              </div>

              {/* Upload Receipt */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Payment Receipt</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="settle-receipt"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <label
                    htmlFor="settle-receipt"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-[11px] font-semibold text-gray-750 hover:bg-gray-55 cursor-pointer shadow-sm"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Attach Image"}
                  </label>
                  {receiptUrl && (
                    <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-xs">✓ Attached</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Record Payment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettlementsTab;
