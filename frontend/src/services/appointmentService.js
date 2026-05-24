import api from "./api";

const appointmentService = {
  getAll: async () => {
    const response = await api.get("/appointments");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },
};

export default appointmentService;
