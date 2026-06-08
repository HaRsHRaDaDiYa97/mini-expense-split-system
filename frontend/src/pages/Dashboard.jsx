import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateGroupForm from "../components/CreateGroupForm";
import GroupCard from "../components/GroupCard";
import { getGroupsApi } from "../api/groupApi";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const res = await getGroupsApi();
      setGroups(res.data.groups);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your shared expenses and groups.
          </p>
        </div>

        {/* Create Group Section */}
        <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Create New Group
          </h2>
          <CreateGroupForm fetchGroups={fetchGroups} />
        </div>

        {/* Groups Grid Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Your Groups
          </h2>
          
          {/* Conditional Rendering for Empty State vs Grid */}
          {groups.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500 font-medium">
                No groups found. Create one above to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard 
                  key={group._id} 
                  group={group} 
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;