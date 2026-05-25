import api from "./api";

const userService = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/users/change-password", data);
    return response.data;
  },

  resetPassword: async (id, newPassword) => {
    const response = await api.put(`/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },
};

export default userService;
