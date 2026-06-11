import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getGroupDetailsApi,
  getExpensesApi,
} from "../api/expenseApi";
import api from "../api/axios";
import { toast } from "sonner";

import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import AddExpenseForm from "../components/AddExpenseForm";
import AddMemberForm from "../components/AddMemberForm";
import ExpenseDetailsModal from "../components/ExpenseDetailsModal";
import SettlementsTab from "../components/SettlementsTab";
import AnalyticsTab from "../components/AnalyticsTab";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import {
  Receipt,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  Archive,
  ArrowRightLeft,
  UserX,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [memberStats, setMemberStats] = useState({});
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Tabs & Loading
  const [activeTab, setActiveTab] = useState("expenses"); // "expenses", "members", "settlements", "analytics"
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [minAmt, setMinAmt] = useState("");
  const [maxAmt, setMaxAmt] = useState("");

  const fetchGroup = async () => {
    try {
      setLoadingGroup(true);
      const res = await getGroupDetailsApi(id);
      setGroup(res.data.group);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch group details");
    } finally {
      setLoadingGroup(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);
      const params = {
        category: catFilter || undefined,
        memberId: memberFilter || undefined,
        minAmount: minAmt || undefined,
        maxAmount: maxAmt || undefined,
      };
      const res = await getExpensesApi(id, params);

      // Client-side text search filter for description
      let filtered = res.data.expenses || [];
      if (search.trim()) {
        filtered = filtered.filter((e) =>
          e.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setExpenses(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const fetchMemberStats = async () => {
    try {
      const res = await api.get(`/groups/${id}/member-stats`);
      setMemberStats(res.data.stats || {});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  useEffect(() => {
    fetchExpenses();
  }, [id, search, catFilter, memberFilter, minAmt, maxAmt]);

  useEffect(() => {
    if (activeTab === "members") {
      fetchMemberStats();
    }
  }, [activeTab]);

  if (loadingGroup && !group) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900 mx-auto mb-2" />
          <p className="text-gray-500 font-medium animate-pulse">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
        <EmptyState
          type="groups"
          title="Group not found"
          description="The group you are trying to view does not exist or you do not have permission to view it."
          actionText="Back to Dashboard"
          onAction={() => navigate("/dashboard")}
        />
      </div>
    );
  }

  const currentUserRole = auth.getMemberRole(group);
  const isOwner = auth.isOwner(group);
  const isAdmin = auth.isAdmin(group);

  const handleArchiveToggle = async () => {
    try {
      const res = await api.put(`/groups/${id}/archive`);
      toast.success(res.data.message);
      fetchGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle archive");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/groups/${id}/members/${memberId}`);
      toast.success("Member removed successfully");
      fetchGroup();
      fetchMemberStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  const handleTransferOwnership = async (newOwnerId) => {
    if (!newOwnerId) return;
    if (!window.confirm("Are you sure you want to transfer group ownership? You will be demoted to Admin.")) return;
    try {
      await api.put(`/groups/${id}/transfer-ownership`, { newOwnerId });
      toast.success("Ownership transferred successfully");
      fetchGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to transfer ownership");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header Area */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-gray-900">{group.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-gray-200 bg-gray-50 text-gray-600 uppercase tracking-wide capitalize">
                {group.category}
              </span>
              {group.isArchived && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-250 bg-amber-50 text-amber-700 uppercase tracking-wide">
                  Archived
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 max-w-xl leading-relaxed">{group.description || "No description provided."}</p>
          </div>

          {/* Group Operations */}
          <div className="flex flex-wrap gap-3">
            {isOwner && (
              <button
                onClick={handleArchiveToggle}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-305 hover:bg-amber-50 rounded-xl text-sm font-semibold text-amber-700 transition-colors cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                {group.isArchived ? "Unarchive Group" : "Archive Group"}
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-250 mb-8 gap-6 overflow-x-auto">
          {[
            { id: "expenses", label: "Expenses", icon: Receipt },
            { id: "members", label: "Members", icon: Users },
            { id: "settlements", label: "Settlements", icon: ShieldCheck },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${active ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div>
          {/* TAB 1: EXPENSES */}
          {activeTab === "expenses" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Expense Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                    Add Expense
                  </h2>
                  <AddExpenseForm
                    groupId={id}
                    fetchExpenses={fetchExpenses}
                    userId={auth.user.id}
                    group={group}
                  />
                </div>
              </div>

              {/* Expense Feed Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* Advanced Expense Filters Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Filters
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Search Field */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-gray-950"
                      />
                    </div>

                    {/* Category Selector */}
                    <select
                      value={catFilter}
                      onChange={(e) => setCatFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-gray-950"
                    >
                      <option value="">All Categories</option>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="hotel">Hotel</option>
                      <option value="shopping">Shopping</option>
                      <option value="fuel">Fuel</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="other">Other</option>
                    </select>

                    {/* Member Selector */}
                    <select
                      value={memberFilter}
                      onChange={(e) => setMemberFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-gray-950"
                    >
                      <option value="">All Payers</option>
                      {group.members.map((m) => (
                        <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                          {m.user?.name || "User"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expenses List */}
                <div className="space-y-4">
                  {loadingExpenses ? (
                    [1, 2].map((n) => <SkeletonLoader key={n} type="expense" />)
                  ) : expenses.length === 0 ? (
                    <EmptyState
                      type="expenses"
                      title="No expenses found"
                      description={
                        search || catFilter || memberFilter
                          ? "Adjust your filters to see more results."
                          : "Log your first shared expense to split the cost."
                      }
                    />
                  ) : (
                    expenses.map((expense) => (
                      <div
                        key={expense._id}
                        onClick={() => setSelectedExpense(expense)}
                        className="cursor-pointer hover:scale-[1.01] transition-transform"
                      >
                        <ExpenseCard expense={expense} />
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === "members" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Add Member Column */}
              <div className="space-y-6">
                {isAdmin && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <AddMemberForm groupId={id} refreshGroup={fetchGroup} />
                  </div>
                )}

                {/* Transfer ownership */}
                {isOwner && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowRightLeft className="w-4 h-4 text-gray-400" /> Transfer Ownership
                    </h3>
                    <select
                      onChange={(e) => handleTransferOwnership(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-950"
                      defaultValue=""
                    >
                      <option value="" disabled>Select new owner...</option>
                      {group.members
                        .filter((m) => (m.user?._id || m.user)?.toString() !== auth.user.id)
                        .map((m) => (
                          <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                            {m.user?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Members List Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">
                    Group Members
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                          <th className="pb-3 font-semibold">Name</th>
                          <th className="pb-3 font-semibold">Role</th>
                          <th className="pb-3 font-semibold text-right">Paid</th>
                          <th className="pb-3 font-semibold text-right">Owed</th>
                          <th className="pb-3 font-semibold text-right">Settled</th>
                          <th className="pb-3 font-semibold text-right">Net Balance</th>
                          {isAdmin && <th className="pb-3 font-semibold text-center">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {group.members.map((member) => {
                          const mId = (member.user?._id || member.user)?.toString();
                          const stats = memberStats[mId] || { totalPaid: 0, totalOwed: 0, totalSettledPaid: 0, totalSettledReceived: 0, totalSettled: 0 };
                          const isSelf = mId === auth.user.id;
                          const showRemove =
                            isAdmin &&
                            !isSelf &&
                            member.role !== "owner" &&
                            (currentUserRole === "owner" || member.role !== "admin");

                          const netBalance = (stats.totalPaid - stats.totalOwed) + (stats.totalSettledPaid || 0) - (stats.totalSettledReceived || 0);

                          return (
                            <tr key={mId} className="hover:bg-gray-50/55 transition-colors">
                              <td className="py-4 font-semibold text-gray-900">
                                {member.user?.name} {isSelf && "(You)"}
                              </td>
                              <td className="py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${member.role === "owner"
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : member.role === "admin"
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                      : "bg-gray-55 text-gray-600 border-gray-150"
                                  }`}>
                                  {member.role}
                                </span>
                              </td>
                              <td className="py-4 text-right font-bold text-gray-900">
                                ₹{stats.totalPaid.toFixed(2)}
                              </td>
                              <td className="py-4 text-right font-bold text-gray-700">
                                ₹{stats.totalOwed.toFixed(2)}
                              </td>
                              <td className="py-4 text-right font-bold text-emerald-650">
                                ₹{stats.totalSettled.toFixed(2)}
                              </td>
                              <td className="py-4 text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black border ${netBalance > 0.005
                                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                                    : netBalance < -0.005
                                      ? "text-rose-700 bg-rose-50 border-rose-100"
                                      : "text-gray-600 bg-gray-55 border-gray-150"
                                  }`}>
                                  {netBalance > 0.005 ? "+" : ""}{netBalance.toFixed(2)}
                                </span>
                              </td>
                              {isAdmin && (
                                <td className="py-4 text-center">
                                  {showRemove ? (
                                    <button
                                      onClick={() => handleRemoveMember(mId)}
                                      className="text-red-500 hover:text-red-750 p-1 rounded hover:bg-red-50 cursor-pointer"
                                      title="Remove Member"
                                    >
                                      <UserX className="w-4 h-4 mx-auto" />
                                    </button>
                                  ) : (
                                    <span className="text-gray-300 text-xs">-</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SETTLEMENTS */}
          {activeTab === "settlements" && (
            <SettlementsTab
              group={group}
              currentUser={auth.user}
              onRefreshDetails={fetchGroup}
            />
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === "analytics" && (
            <AnalyticsTab expenses={expenses} group={group} />
          )}

        </div>

      </main>

      {/* Expense details dialog popup */}
      {selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          group={group}
          currentUser={auth.user}
          onClose={() => setSelectedExpense(null)}
          onRefresh={() => {
            fetchExpenses();
            fetchGroup();
          }}
        />
      )}
    </div>
  );
};

export default GroupDetails;