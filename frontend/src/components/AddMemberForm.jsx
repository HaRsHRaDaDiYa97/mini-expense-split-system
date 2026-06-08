import { useEffect, useState } from "react";
import { getUsersApi, addMemberApi } from "../api/groupApi";
import { toast } from "sonner";

const AddMemberForm = ({ groupId, refreshGroup }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getUsersApi();
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddMember = async () => {
    if (!selectedUser) return;

    try {
      const res = await addMemberApi(groupId, selectedUser);
      toast.success(res.data.message);
      refreshGroup();
      setSelectedUser("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add member"
      );
    }
  };

  return (
    <div className="space-y-3">
      
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        Add New Member
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Select Input Group */}
        <div className="flex-grow">
          <label htmlFor="userSelect" className="sr-only">
            Select User
          </label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 bg-white"
          >
            <option value="" disabled>
              Select a user to add...
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Action */}
        <button
          onClick={handleAddMember}
          className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex-shrink-0 whitespace-nowrap"
        >
          Add Member
        </button>

      </div>
    </div>
  );
};

export default AddMemberForm;