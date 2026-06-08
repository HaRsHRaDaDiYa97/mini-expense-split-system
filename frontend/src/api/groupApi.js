import api from "./axios";

export const createGroupApi = (data) => {
  return api.post("/groups", data);
};

export const getGroupsApi = () => {
  return api.get("/groups");
};

export const getUsersApi = () => {
  return api.get("/auth/users");
};

export const addMemberApi = (
  groupId,
  userId
) => {
  return api.put(
    `/groups/${groupId}/add-member`,
    { userId }
  );
};