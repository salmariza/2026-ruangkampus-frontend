import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const AddRoomPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Nama ruangan wajib diisi.");
    if (!location.trim()) return setError("Lokasi wajib diisi.");
    if (capacity <= 0) return setError("Capacity harus lebih dari 0.");

    try {
      setLoading(true);

      await api.post("/Rooms", {
        name: name.trim(),
        location: location.trim(),
        capacity,
        isActive,
      });

      navigate("/rooms");
    } catch (err: any) {
      console.error(err);
      setError("Gagal menambahkan ruangan. Cek backend / payload ya.");
    } finally {
      setLoading(false);
    }
  };

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
            Tambah Ruangan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lengkapi data ruangan untuk ditambahkan ke sistem.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/rooms"
          variant="outlined"
          color="primary"
        >
          ← Kembali
        </Button>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.2}>
          <TextField
            label="Nama Ruangan"
            placeholder="Contoh: Auditorium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Lokasi"
            placeholder="Contoh: Gedung Pascasarjana Lantai 6"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
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
                disabled={loading}
            >
            Batal
            </Button>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
            >
            {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            </Stack>
        </Stack>
    </Box>
    </Paper>
    );
};

export default AddRoomPage;
