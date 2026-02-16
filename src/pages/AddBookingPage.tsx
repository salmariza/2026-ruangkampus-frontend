import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Room = {
  id: number;
  name: string;
  isActive: boolean;
};

const AddBookingPage: React.FC = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState<number | "">("");

  const [bookerName, setBookerName] = useState("");
  const [purposeOfBooking, setPurposeOfBooking] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/Rooms");
        const activeRooms = (res.data as Room[]).filter((r) => r.isActive);
        setRooms(activeRooms);
      } catch (e) {
        console.error(e);
        setError("Gagal fetch daftar ruangan.");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // validasi
    if (!roomId) return setError("Pilih ruangan dulu.");
    if (!bookerName.trim()) return setError("Nama peminjam wajib diisi.");
    if (!purposeOfBooking.trim())
      return setError("Tujuan peminjaman wajib diisi.");
    if (!startTime) return setError("Start time wajib diisi.");
    if (!endTime) return setError("End time wajib diisi.");

    // validasi start < end
    const st = new Date(startTime).getTime();
    const et = new Date(endTime).getTime();
    if (!Number.isNaN(st) && !Number.isNaN(et) && st >= et) {
      return setError("StartTime harus lebih kecil dari EndTime.");
    }

    const selectedRoom = rooms.find((r) => r.id === Number(roomId));
    if (!selectedRoom) return setError("Ruangan tidak ditemukan.");

    try {
      setSaving(true);

      const payload = {
        RoomId: Number(roomId),
        RoomName: selectedRoom.name,
        BookerName: bookerName.trim(),
        PurposeOfBooking: purposeOfBooking.trim(),
        StartTime: new Date(startTime).toISOString(),
        EndTime: new Date(endTime).toISOString(),
        Status: "Pending",
      };

      await api.post("/RoomBookings", payload);

      navigate("/room-bookings");
    } catch (e: any) {
      console.error(e);

      const data = e?.response?.data;
      let msg = "Gagal membuat booking.";

      if (typeof data === "string") {
        msg = data;
      } else if (data?.errors) {
        const firstField = Object.keys(data.errors)[0];
        const firstMsg = data.errors?.[firstField]?.[0];
        msg = firstMsg || data.title || msg;
      } else if (data?.title || data?.message) {
        msg = data.title || data.message;
      }

      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, maxWidth: 760, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Buat Booking Ruangan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ajukan peminjaman ruangan sesuai kebutuhan Anda.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/room-bookings"
          variant="outlined"
          color="primary"
        >
          ← Kembali
        </Button>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {loadingRooms ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Loading rooms...</Typography>
        </Stack>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.2}>
            <TextField
              select
              label="Pilih Ruangan"
              value={roomId}
              onChange={(e) =>
                setRoomId(e.target.value ? Number(e.target.value) : "")
              }
              fullWidth
              required
            >
              <MenuItem value="">-- pilih ruangan --</MenuItem>
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nama Peminjam"
              value={bookerName}
              onChange={(e) => setBookerName(e.target.value)}
              placeholder="Contoh: Salma"
              fullWidth
              required
            />

            <TextField
              label="Tujuan Peminjaman"
              value={purposeOfBooking}
              onChange={(e) => setPurposeOfBooking(e.target.value)}
              placeholder="Contoh: Rapat UKM"
              fullWidth
              required
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Waktu Mulai"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                label="Waktu Selesai"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                component={RouterLink}
                to="/room-bookings"
                variant="outlined"
                color="primary"
                disabled={saving}
              >
                Batal
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Buat Booking"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default AddBookingPage;
