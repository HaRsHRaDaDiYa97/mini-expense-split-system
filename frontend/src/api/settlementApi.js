import api from "./axios";

export const getSettlementsApi = (
  groupId
) => {
  return api.get(
    `/groups/${groupId}/settlements`
  );
};