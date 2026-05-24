import api from "./api";

const counselorService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.specialty) params.append("specialty", filters.specialty);
    if (filters.search) params.append("search", filters.search);
    const response = await api.get(`/counselors?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/counselors/${id}`);
    return response.data;
  },
};

export default counselorService;
