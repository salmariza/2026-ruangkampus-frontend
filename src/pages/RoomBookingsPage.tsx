import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api, { updateBookingStatus } from "../services/api";

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

type RoomBooking = {
  id: number;
  roomId: number;
  bookerName: string;
  purposeOfBooking: string;
  startTime: string;
  endTime: string;
  status: string;
};

const formatDT = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const toStatusText = (status: any) => String(status ?? "").trim().toLowerCase();

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const s = toStatusText(status);

  // Support enum-like "0/1/2" OR text "pending/approved/rejected"
  const isPending = s === "pending" || s === "0";
  const isApproved = s === "approved" || s === "approve" || s === "1";
  const isRejected = s === "rejected" || s === "reject" || s === "2";

  if (isPending) {
    return (
      <Chip
        label="Pending"
        size="small"
        sx={{
          bgcolor: "#FDE68A",
          color: "#78350F",
          fontWeight: 800,
        }}
      />
    );
  }

  if (isApproved) {
    return (
      <Chip
        label="Approved"
        size="small"
        sx={{
          bgcolor: "#D1FAE5",
          color: "#065F46",
          fontWeight: 800,
        }}
      />
    );
  }

  if (isRejected) {
    return (
      <Chip
        label="Rejected"
        size="small"
        sx={{
          bgcolor: "#FECACA",
          color: "#7F1D1D",
          fontWeight: 800,
        }}
      />
    );
  }

  // fallback: show raw status but still styled
  return (
    <Chip
      label={status}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 700 }}
    />
  );
};

const RoomBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setError(null);
      const res = await api.get("/RoomBookings");
      setBookings(res.data);
    } catch (e) {
      console.error(e);
      setError("Gagal fetch booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus booking ini?")) return;
    try {
      await api.delete(`/RoomBookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error(e);
      alert("Gagal hapus booking");
    }
  };

  const handleChangeStatus = async (id: number, nextStatus: 1 | 2) => {
    try {
      setUpdatingId(id);
      await updateBookingStatus(id, nextStatus); // 1=Approved, 2=Rejected
      await fetchBookings();
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data || e?.message || "Gagal update status";
      alert(typeof msg === "string" ? msg : "Gagal update status");
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

  if (error) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
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
            Pantau status booking dan lakukan persetujuan bila diperlukan.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/rooms"
            variant="outlined"
            color="primary"
          >
            ← Rooms
          </Button>
          <Button
            component={RouterLink}
            to="/add-booking"
            variant="contained"
            color="primary"
          >
            Buat Booking
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {bookings.length > 0 ? (
        <TableContainer
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nama Peminjam</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tujuan</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 190 }}>
                  Mulai
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 190 }}>
                  Selesai
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 260 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 220 }}>
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b) => {
                const statusText = toStatusText(b.status);
                const isPending =
                  statusText === "pending" || statusText === "0";
                const isUpdating = updatingId === b.id;

                return (
                  <TableRow key={b.id} hover sx={{ "& td": { py: 1.6 } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>
                        {b.bookerName}
                      </Typography>
                      
                    </TableCell>

                    <TableCell>{b.purposeOfBooking}</TableCell>
                    <TableCell>{formatDT(b.startTime)}</TableCell>
                    <TableCell>{formatDT(b.endTime)}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <StatusChip status={b.status} />

                        {isPending && (
                          <Stack direction="row" spacing={1}>
                            <Button
                              onClick={() => handleChangeStatus(b.id, 1)}
                              disabled={isUpdating}
                              variant="outlined"
                              color="success"
                              size="small"
                            >
                              {isUpdating ? "..." : "Approve"}
                            </Button>

                            <Button
                              onClick={() => handleChangeStatus(b.id, 2)}
                              disabled={isUpdating}
                              variant="outlined"
                              color="error"
                              size="small"
                            >
                              {isUpdating ? "..." : "Reject"}
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          component={RouterLink}
                          to={`/edit-booking/${b.id}`}
                          variant="outlined"
                          color="primary"
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(b.id)}
                          variant="outlined"
                          color="error"
                          size="small"
                        >
                          Hapus
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">Belum ada booking.</Alert>
      )}
    </Paper>
  );
};

export default RoomBookingsPage;
