import api from "./api";

const availabilityService = {
  getAvailability: async (counselorId) => {
    const response = await api.get(`/availability/${counselorId}`);
    return response.data;
  },

  updateAvailability: async (counselorId, data) => {
    const response = await api.put(`/availability/${counselorId}`, data);
    return response.data;
  },

  getSlots: async (counselorId, date) => {
    const response = await api.get(
      `/availability/${counselorId}/slots?date=${date}`,
    );
    return response.data;
  },
};

export default availabilityService;
