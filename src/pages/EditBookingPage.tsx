import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { getRooms, getRoomBookingById, BookingStatusText } from "../services/api";

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
  location: string;
  capacity: number;
  isActive: boolean;
};

const toInputValue = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const toIsoFromInput = (value: string) => {
  return new Date(value).toISOString();
};

const EditBookingPage: React.FC = () => {
  const { id } = useParams();
  const bookingId = Number(id);
  const nav = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // form state
  const [roomId, setRoomId] = useState<number>(0);
  const [bookerName, setBookerName] = useState("");
  const [purposeOfBooking, setPurposeOfBooking] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState<BookingStatusText>("Pending");

  const activeRooms = useMemo(() => rooms.filter((r) => r.isActive), [rooms]);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!bookingId || Number.isNaN(bookingId)) {
          setError("ID booking tidak valid.");
          return;
        }

        const [roomsData, booking] = await Promise.all([
          getRooms(),
          getRoomBookingById(bookingId),
        ]);

        setRooms(roomsData);

        setRoomId(booking.roomId);
        setBookerName(booking.bookerName ?? "");
        setPurposeOfBooking(booking.purposeOfBooking ?? "");
        setStartTime(toInputValue(booking.startTime));
        setEndTime(toInputValue(booking.endTime));

        const s = (booking.status ?? "Pending") as BookingStatusText;
        setStatus(s);
      } catch (e: any) {
        console.error(e);
        setError("Gagal memuat data booking.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!roomId) return setError("Pilih ruangan dulu.");
    if (!bookerName.trim()) return setError("Nama peminjam wajib diisi.");
    if (!purposeOfBooking.trim())
      return setError("Tujuan peminjaman wajib diisi.");
    if (!startTime || !endTime)
      return setError("Waktu mulai & selesai wajib diisi.");

    const startIso = toIsoFromInput(startTime);
    const endIso = toIsoFromInput(endTime);

    if (new Date(startIso) >= new Date(endIso)) {
      return setError("Waktu selesai harus lebih besar dari waktu mulai.");
    }

    const selectedRoom = rooms.find((r) => r.id === roomId);
    if (!selectedRoom) return setError("Ruangan tidak ditemukan.");

    try {
      setSaving(true);

      const payload = {
        RoomId: roomId,
        RoomName: selectedRoom.name,
        BookerName: bookerName.trim(),
        PurposeOfBooking: purposeOfBooking.trim(),
        StartTime: startIso,
        EndTime: endIso,
        Status: status, // "Pending" | "Approved" | "Rejected"
      };

      await api.patch(`/RoomBookings/${bookingId}`, payload);

      nav("/room-bookings");
    } catch (e: any) {
      console.error(e);

      const data = e?.response?.data;
      let msg = "Gagal menyimpan perubahan booking.";

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

  if (loading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Loading booking...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, maxWidth: 760, mx: "auto" }}>
      {/* Header*/}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Edit Booking Ruangan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Perbarui informasi peminjaman ruangan.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/room-bookings"
          variant="outlined"
          color="primary"
          disabled={saving}
        >
          ← Kembali
        </Button>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.2}>
          <TextField
            select
            label="Pilih Ruangan"
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            fullWidth
            required
          >
            <MenuItem value={0}>-- Pilih Ruangan --</MenuItem>
            {activeRooms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Nama Peminjam"
            value={bookerName}
            onChange={(e) => setBookerName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Tujuan Peminjaman"
            value={purposeOfBooking}
            onChange={(e) => setPurposeOfBooking(e.target.value)}
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

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatusText)}
            fullWidth
            required
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>

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
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EditBookingPage;
