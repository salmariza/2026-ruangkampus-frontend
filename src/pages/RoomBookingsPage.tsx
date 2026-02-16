import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type Room = {
  id: number;
  name: string;
  isActive: boolean;
};

type RoomBooking = {
  id: number;
  roomId: number;

  roomName?: string | null;

  bookerName: string;
  purposeOfBooking: string;
  startTime: string;
  endTime: string;
  status: string; // "pending" / "approved" / "rejected" dll
};

const formatDT = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const normalizeStatus = (s: any) => String(s ?? "").trim().toLowerCase();

const statusChip = (statusRaw: string) => {
  const s = normalizeStatus(statusRaw);

  if (s === "pending" || s === "0") {
    return (
      <Chip
        label="Pending"
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 700,
          borderColor: "#8a6a00",
          color: "#8a6a00",
          backgroundColor: "rgba(138, 106, 0, 0.10)",
        }}
      />
    );
  }

  if (s === "approved" || s === "1") {
    return (
      <Chip
        label="Approved"
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 700,
          borderColor: "#0b5d3b",
          color: "#0b5d3b",
          backgroundColor: "rgba(11, 93, 59, 0.10)",
        }}
      />
    );
  }

  if (s === "rejected" || s === "2") {
    return (
      <Chip
        label="Rejected"
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 700,
          borderColor: "#7a1d1d",
          color: "#7a1d1d",
          backgroundColor: "rgba(122, 29, 29, 0.10)",
        }}
      />
    );
  }

  // fallback
  return <Chip label={statusRaw || "-"} size="small" variant="outlined" />;
};

const RoomBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const roomNameById = useMemo(() => {
    const map = new Map<number, string>();
    rooms.forEach((r) => map.set(r.id, r.name));
    return map;
  }, [rooms]);

  const fetchAll = async () => {
    try {
      setError(null);
      setLoading(true);

      const [bookRes, roomRes] = await Promise.all([
        api.get("/RoomBookings"),
        api.get("/Rooms"),
      ]);

      setBookings(bookRes.data);
      setRooms(roomRes.data);
    } catch (e: any) {
      console.error(e);
      setError("Gagal fetch data bookings / rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resolveRoomName = (b: RoomBooking) => {
    const fromBooking =
      (b as any).RoomName ?? (b as any).roomName ?? b.roomName ?? null;
    return fromBooking || roomNameById.get(b.roomId) || "";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus booking ini?")) return;
    try {
      await api.delete(`/RoomBookings/${id}`);
      setBookings((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      alert("Gagal hapus booking");
    }
  };

  const handleChangeStatus = async (b: RoomBooking, next: "Approved" | "Rejected") => {
    const isUpdating = updatingId === b.id;
    if (isUpdating) return;

    try {
      setUpdatingId(b.id);

      const roomName = resolveRoomName(b);
      if (!roomName) {
        alert("RoomName kosong. Backend minta RoomName, jadi butuh mapping roomId → name.");
        return;
      }

      const payload = {
        RoomId: b.roomId,
        RoomName: roomName,
        BookerName: b.bookerName,
        PurposeOfBooking: b.purposeOfBooking,
        StartTime: b.startTime,
        EndTime: b.endTime,
        Status: next, 
      };

      await api.patch(`/RoomBookings/${b.id}`, payload);
      await fetchAll();
    } catch (e: any) {
      console.error(e);
      const data = e?.response?.data;
      const msg =
        typeof data === "string"
          ? data
          : data?.title || data?.message || JSON.stringify(data);
      alert(msg || "Gagal update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Loading bookings...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, maxWidth: 1100, mx: "auto" }}>
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
            Daftar Peminjaman Ruangan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola pengajuan booking: approve, reject, edit, atau hapus.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button component={RouterLink} to="/rooms" variant="outlined">
            ← Rooms
          </Button>
          <Button component={RouterLink} to="/add-booking" variant="contained">
            Buat Booking
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Peminjam</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Ruangan</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Tujuan</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Mulai</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Selesai</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Aksi
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">Belum ada booking.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => {
                const s = normalizeStatus(b.status);
                const isPending = s === "pending" || s === "0";
                const isUpdating = updatingId === b.id;

                return (
                  <TableRow key={b.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{b.bookerName}</TableCell>
                    <TableCell>{resolveRoomName(b) || `Room #${b.roomId}`}</TableCell>
                    <TableCell>{b.purposeOfBooking}</TableCell>
                    <TableCell>{formatDT(b.startTime)}</TableCell>
                    <TableCell>{formatDT(b.endTime)}</TableCell>
                    <TableCell>{statusChip(b.status)}</TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                        {isPending && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={isUpdating}
                              onClick={() => handleChangeStatus(b, "Approved")}
                              sx={{
                                borderColor: "#0b5d3b",
                                color: "#0b5d3b",
                                "&:hover": { borderColor: "#0b5d3b" },
                              }}
                            >
                              {isUpdating ? "..." : "Approve"}
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              disabled={isUpdating}
                              onClick={() => handleChangeStatus(b, "Rejected")}
                              sx={{
                                borderColor: "#7a1d1d",
                                color: "#7a1d1d",
                                "&:hover": { borderColor: "#7a1d1d" },
                              }}
                            >
                              {isUpdating ? "..." : "Reject"}
                            </Button>
                          </>
                        )}

                        <Button
                          size="small"
                          variant="outlined"
                          component={RouterLink}
                          to={`/edit-booking/${b.id}`}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(b.id)}
                        >
                          Hapus
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RoomBookingsPage;
