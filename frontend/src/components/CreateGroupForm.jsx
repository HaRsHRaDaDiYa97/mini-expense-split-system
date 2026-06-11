import { useState } from "react";
import { createGroupApi } from "../api/groupApi";
import { toast } from "sonner";
import { Folder, Compass, Users2, Briefcase, Calendar, Plus, Loader2 } from "lucide-react";

const CreateGroupForm = ({ fetchGroups }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      await createGroupApi({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        members: [],
      });

      toast.success("Group Created successfully!");
      setFormData({
        name: "",
        description: "",
        category: "other",
      });
      fetchGroups();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create group"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Group Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Goa Trip 2026, Rent Split"
            value={formData.name}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="other">Other / General</option>
            <option value="trip">Trip / Travel</option>
            <option value="friends">Friends / Outing</option>
            <option value="family">Family / Home</option>
            <option value="office">Office / Projects</option>
            <option value="event">Event / Party</option>
          </select>
        </div>

      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="What is this group tracking?"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-gray-950 focus:border-transparent outline-none transition-all duration-200 resize-none"
        />
      </div>

      {/* Submit Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Group
            </>
          )}
        </button>
      </div>
      
    </form>
  );
};

export default CreateGroupForm;