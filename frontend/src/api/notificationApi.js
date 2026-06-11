import api from "./axios";

export const getNotificationsApi = () => {
  return api.get("/notifications");
};

export const markNotificationsReadApi = () => {
  return api.put("/notifications/read");
};
