import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5042/api",
  timeout: 10000,
});

export default api;

// =====================
// Rooms
// =====================
export const getRooms = async () => {
  const res = await api.get("/Rooms");
  return res.data;
};

export const getRoomById = async (id: number) => {
  const res = await api.get(`/Rooms/${id}`);
  return res.data;
};

export const createRoom = async (payload: {
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
}) => {
  const res = await api.post("/Rooms", payload);
  return res.data;
};

export const updateRoom = async (
  id: number,
  payload: {
    name: string;
    location: string;
    capacity: number;
    isActive: boolean;
  }
) => {
  const res = await api.put(`/Rooms/${id}`, payload);
  return res.data;
};

export const deleteRoom = async (id: number) => {
  await api.delete(`/Rooms/${id}`);
};

// =====================
// RoomBookings
// =====================
export type BookingStatusText = "Pending" | "Approved" | "Rejected";
export type BookingStatusCode = 0 | 1 | 2; // 0 Pending, 1 Approved, 2 Rejected

export const getRoomBookings = async () => {
  const res = await api.get("/RoomBookings");
  return res.data;
};

export const getRoomBookingById = async (id: number) => {
  const res = await api.get(`/RoomBookings/${id}`);
  return res.data;
};

export const createRoomBooking = async (payload: {
  roomId: number;
  bookerName: string;
  purposeOfBooking: string;
  startTime: string; // ISO string recommended
  endTime: string;   // ISO string recommended
  status?: BookingStatusText; // opsional (biasanya backend set Pending)
}) => {
  const res = await api.post("/RoomBookings", payload);
  return res.data;
};

export const updateRoomBooking = async (
  id: number,
  payload: {
    roomId: number;
    bookerName: string;
    purposeOfBooking: string;
    startTime: string;
    endTime: string;
    status: BookingStatusText;
  }
) => {
  const res = await api.patch(`/RoomBookings/${id}`, payload);
  return res.data;
};

export const deleteRoomBooking = async (id: number) => {
  await api.delete(`/RoomBookings/${id}`);
};

// ✅ Approve / Reject / Pending (tanpa role)
export const updateBookingStatus = async (id: number, status: BookingStatusCode) => {
  const res = await api.patch(`/RoomBookings/${id}/status`, status, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// =====================
// RoomBookings Filters
// =====================
// by-status?status=Approved
export const getRoomBookingsByStatus = async (status: BookingStatusText) => {
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
