import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5042/api', 
  timeout: 10000, 
});

export const getRoomBookingsByStatus = async () => {
  try {
    const response = await api.get('RoomBookings/by-status');
    return response.data;
  } catch (error) {
    console.error("Error fetching statuses:", error);
    throw error;
  }
};

export const getRoomBookingsByRoom = async () => {
  try {
    const response = await api.get('RoomBookings/by-room');
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

export const getRoomBookingsByDate = async () => {
  try {
    const response = await api.get('RoomBookings/by-date');
    return response.data;
  } catch (error) {
    console.error("Error fetching dates:", error);
    throw error;
  }
};

export default api;
