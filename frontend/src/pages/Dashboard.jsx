import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateGroupForm from "../components/CreateGroupForm";
import GroupCard from "../components/GroupCard";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { getGroupsApi } from "../api/groupApi";
import { Search, FolderOpen, Users, Compass, FolderClosed, Plus } from "lucide-react";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "archived"
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const includeArchived = activeTab === "archived";
      const res = await getGroupsApi({
        search: search.trim() || undefined,
        category: category || undefined,
        includeArchived,
      });
      setGroups(res.data.groups || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search, category, activeTab]);

  // Compute metrics from all groups (active & archived)
  // Let's do a separate fetch or compute from current view
  const activeGroupsCount = groups.filter((g) => !g.isArchived).length;
  
  // Calculate total unique members across groups
  const uniqueMemberIds = new Set();
  groups.forEach((g) => {
    g.members?.forEach((m) => {
      const id = m.user?._id || m.user;
      if (id) uniqueMemberIds.add(id.toString());
    });
  });
  const totalUniqueMembers = uniqueMemberIds.size;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Split shared costs, track travel expenses, and manage settlements.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            New Group
          </button>
        </div>

        {/* Create Group Form Card */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-in fade-in slide-in-from-top-3 duration-250">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
              Create New Expense Group
            </h2>
            <CreateGroupForm fetchGroups={() => { fetchGroups(); setShowCreateForm(false); }} />
          </div>
        )}

        {/* Dashboard SaaS Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Groups</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{activeGroupsCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-650 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Members</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{totalUniqueMembers}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-650 flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Group Categories</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">6 Active</h3>
            </div>
          </div>

        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8 space-y-4">
          
          {/* Tabs for Active vs Archived */}
          <div className="flex border-b border-gray-100 pb-3 gap-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "active" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-650"
              }`}
            >
              Active Groups
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`pb-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "archived" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-650"
              }`}
            >
              Archived Groups
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-450 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groups by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-905 outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Select Filter */}
            <div className="w-full sm:w-48 flex-shrink-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="trip">Trip / Travel</option>
                <option value="friends">Friends</option>
                <option value="family">Family</option>
                <option value="office">Office</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

        </div>

        {/* Group Listing Feed */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <SkeletonLoader key={n} type="card" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <EmptyState
              type={activeTab === "archived" ? "settlements" : "groups"}
              title={search || category ? "No matching groups found" : activeTab === "archived" ? "No archived groups" : "No expense groups"}
              description={
                search || category
                  ? "Try adjusting your search criteria or category filter."
                  : activeTab === "archived"
                  ? "Archive old groups from their settings tab to clean up your dashboard."
                  : "Get started by creating your first group to track shared bills."
              }
              actionText={!search && !category && activeTab === "active" ? "Create Group" : null}
              onAction={() => setShowCreateForm(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;