import api from "./api";

const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  getCounselors: async () => {
    const response = await api.get("/admin/counselors");
    return response.data;
  },

  toggleCounselor: async (id) => {
    const response = await api.put(`/admin/counselors/${id}/toggle`);
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await api.get("/admin/appointments");
    return response.data;
  },
  createCounselor: async (data) => {
    const response = await api.post("/admin/counselors", data);
    return response.data;
  },
  updateCounselor: async (id, data) => {
    const response = await api.put(`/admin/counselors/${id}`, data);
    return response.data;
  },
};

export default adminService;
