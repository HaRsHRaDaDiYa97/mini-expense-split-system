import { useState } from "react";
import { createGroupApi } from "../api/groupApi";
import { toast } from "sonner";

const CreateGroupForm = ({ fetchGroups }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission of empty strings
    if (!groupName.trim()) return;

    try {
      await createGroupApi({
        name: groupName.trim(),
        members: [],
      });

      toast.success("Group Created");
      setGroupName("");
      fetchGroups();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create group"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      
      {/* Input Group */}
      <div className="flex-grow">
        <label htmlFor="groupName" className="sr-only">
          Group Name
        </label>
        <input
          id="groupName"
          type="text"
          placeholder="Enter new group name..."
          value={groupName}
          required
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
        />
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex-shrink-0 whitespace-nowrap"
      >
        Create Group
      </button>
      
    </form>
  );
};

export default CreateGroupForm;