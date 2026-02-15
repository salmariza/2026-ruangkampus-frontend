import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5042/api",
  timeout: 10000,
});

export default api;

// ===== Rooms =====
export const getRooms = async () => {
  const res = await api.get("/Rooms");
  return res.data;
};

export const deleteRoom = async (id: number) => {
  await api.delete(`/Rooms/${id}`);
};

// ===== RoomBookings (filter endpoints) =====
// by-status?status=Approved
export const getRoomBookingsByStatus = async (status: string) => {
  const res = await api.get("/RoomBookings/by-status", {
    params: { status },
  });
  return res.data;
};

// by-room?roomId=1
export const getRoomBookingsByRoom = async (roomId: number) => {
  const res = await api.get("/RoomBookings/by-room", {
    params: { roomId },
  });
  return res.data;
};

// by-date?date=2026-02-15
export const getRoomBookingsByDate = async (date: string) => {
  const res = await api.get("/RoomBookings/by-date", {
    params: { date },
  });
  return res.data;
};
