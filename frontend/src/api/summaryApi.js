import api from "./axios";

export const getSummaryApi = (
  groupId
) => {
  return api.get(
    `/groups/${groupId}/summary`
  );
};