import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
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

const EditRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setError(null);
        const res = await api.get(`/Rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data ruangan.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    if (!room.name.trim()) return setError("Nama ruangan wajib diisi.");
    if (!room.location.trim()) return setError("Lokasi wajib diisi.");
    if (room.capacity <= 0) return setError("Capacity harus lebih dari 0.");

    try {
      setSaving(true);
      setError(null);

      await api.put(`/Rooms/${room.id}`, {
        id: room.id,
        name: room.name.trim(),
        location: room.location.trim(),
        capacity: room.capacity,
        isActive: room.isActive,
      });

      navigate("/rooms");
    } catch (err) {
      console.error(err);
      setError("Gagal update ruangan. Cek backend / payload ya.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Loading room...</Typography>
        </Stack>
      </Paper>
    );
  }

  if (error && !room) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/rooms" variant="outlined" color="primary">
            ← Kembali
          </Button>
        </Box>
      </Paper>
    );
  }

  if (!room) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">Data ruangan tidak ditemukan.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/rooms" variant="outlined" color="primary">
            ← Kembali
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, maxWidth: 720, mx: "auto" }}>
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
            Edit Ruangan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Perbarui informasi ruangan yang sudah terdaftar.
          </Typography>
        </Box>

        <Button component={RouterLink} to="/rooms" variant="outlined" color="primary">
          ← Kembali
        </Button>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.2}>
          <TextField
            label="Nama Ruangan"
            value={room.name}
            onChange={(e) => setRoom({ ...room, name: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label="Lokasi"
            value={room.location}
            onChange={(e) => setRoom({ ...room, location: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label="Capacity"
            type="number"
            value={room.capacity}
            onChange={(e) =>
              setRoom({ ...room, capacity: Number(e.target.value) })
            }
            fullWidth
            inputProps={{ min: 0 }}
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={room.isActive}
                onChange={(e) =>
                  setRoom({ ...room, isActive: e.target.checked })
                }
                color="primary"
              />
            }
            label="Aktif"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              component={RouterLink}
              to="/rooms"
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
              {saving ? "Menyimpan..." : "Update"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EditRoomPage;
