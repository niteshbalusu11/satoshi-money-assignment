import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const createUser = async (data: { name: string }) => {
  const response = await axios.post(`${API_URL}/createuser`, data);
  return response;
};

export const getUser = async (id: string) => {
  const response = await axios.get(`${API_URL}/getuser/${id}`);
  return response;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const sendTokens = async (data: {
  id: string;
  receiverId: string;
  amount: number;
}) => {
  const response = await axios.post(`${API_URL}/send`, data);
  return response;
};
