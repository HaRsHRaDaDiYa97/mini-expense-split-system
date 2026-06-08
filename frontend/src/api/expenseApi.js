import api from "./axios";

export const getGroupDetailsApi = (groupId) => {
  return api.get(`/groups/${groupId}`);
};

export const getExpensesApi = (groupId) => {
  return api.get(`/groups/${groupId}/expenses`);
};

export const addExpenseApi = (groupId, data) => {
  return api.post(
    `/groups/${groupId}/expenses`,
    data
  );
};