import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import RoomBookingsFilter from "../components/RoomBookingsFilter";

import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";

type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
};

type Filters = {
  keyword: string;
  isActive: "" | "true" | "false";
  roomId: "" | string;
};

const RoomListPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    keyword: "",
    isActive: "",
    roomId: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/Rooms");
        console.log("ROOMS:", res.data);
        setRooms(res.data);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    const kw = filters.keyword.trim().toLowerCase();
    if (kw) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(kw) ||
          r.location.toLowerCase().includes(kw)
      );
    }

    if (filters.isActive) {
      const active = filters.isActive === "true";
      result = result.filter((r) => r.isActive === active);
    }

    if (filters.roomId) {
      const id = Number(filters.roomId);
      result = result.filter((r) => r.id === id);
    }

    return result;
  }, [rooms, filters]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus ruangan ini?")) return;

    try {
      await api.delete(`/Rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert("Gagal hapus ruangan");
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Loading rooms...</Typography>
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
            Daftar Ruangan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola dan pantau data ruangan kampus.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/add-room"
          variant="contained"
          color="primary"
        >
          Tambah Ruangan
        </Button>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Box sx={{ mb: 2.5 }}>
        <RoomBookingsFilter
          rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
          onFilter={(f) => setFilters(f)}
        />
      </Box>

      {/* Table */}
      {filteredRooms.length > 0 ? (
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
                <TableCell sx={{ fontWeight: 700 }}>Nama Ruangan</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 130 }}>
                  Kapasitas
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Lokasi</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 140 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 220 }}>
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow
                  key={room.id}
                  hover
                  sx={{
                    "& td": { py: 1.6 },
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {room.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
          
                    </Typography>
                  </TableCell>

                  <TableCell>{room.capacity}</TableCell>

                  <TableCell>{room.location}</TableCell>

                  <TableCell>
                    {room.isActive ? (
                      <Chip
                        label="Aktif"
                        size="small"
                        sx={{
                          bgcolor: "#D1FAE5",
                          color: "#065F46",
                          fontWeight: 700,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Tidak Aktif"
                        size="small"
                        sx={{
                          bgcolor: "#FECACA",
                          color: "#7F1D1D",
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        component={RouterLink}
                        to={`/edit-room/${room.id}`}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={() => handleDelete(room.id)}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Hapus
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">Belum ada ruangan yang tersedia.</Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          component={RouterLink}
          to="/room-bookings"
          variant="text"
          color="primary"
        >
          Go to Room Bookings
        </Button>
      </Box>
    </Paper>
  );
};

export default RoomListPage;
