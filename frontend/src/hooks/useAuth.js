import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;

  const getMemberRole = (group, userId = user?.id) => {
    if (!group || !group.members || !userId) return "member";
    const found = group.members.find((m) => {
      const id = m.user?._id || m.user;
      return id?.toString() === userId?.toString();
    });
    return found ? found.role : "member";
  };

  const isOwner = (group, userId = user?.id) => {
    return getMemberRole(group, userId) === "owner";
  };

  const isAdmin = (group, userId = user?.id) => {
    const role = getMemberRole(group, userId);
    return role === "owner" || role === "admin";
  };

  return {
    user,
    token,
    isAuthenticated,
    getMemberRole,
    isOwner,
    isAdmin,
  };
};

export default useAuth;
