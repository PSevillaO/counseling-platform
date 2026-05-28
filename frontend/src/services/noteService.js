import api from "./api";

const noteService = {
  getNotes: async (clientId) => {
    const response = await api.get(`/notes/${clientId}`);
    return response.data;
  },

  createNote: async (clientId, data) => {
    const response = await api.post(`/notes/${clientId}`, data);
    return response.data;
  },

  updateNote: async (noteId, content) => {
    const response = await api.put(`/notes/${noteId}`, { content });
    return response.data;
  },

  deleteNote: async (noteId) => {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  },
};

export default noteService;
