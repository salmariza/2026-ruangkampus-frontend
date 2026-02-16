import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

type Room = {
  id: number;
  name: string;
};

type Props = {
  rooms: Room[];
  onFilter: (filters: {
    keyword: string;
    isActive: "" | "true" | "false";
    roomId: "" | string;
  }) => void;
};

const RoomBookingsFilter: React.FC<Props> = ({ rooms, onFilter }) => {
  const [keyword, setKeyword] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [roomId, setRoomId] = useState<"" | string>("");

  useEffect(() => {
    const t = setTimeout(() => {
      onFilter({ keyword, isActive, roomId });
    }, 250);

    return () => clearTimeout(t);
  }, [keyword, isActive, roomId, onFilter]);

  const roomOptions = useMemo(() => rooms ?? [], [rooms]);

  return (
    <Box sx={{ mb: 1 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <TextField
          label="Cari Ruangan / Lokasi"
          variant="outlined"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ minWidth: 240 }}
        />

        <TextField
          select
          label="Status"
          size="small"
          value={isActive}
          onChange={(e) => setIsActive(e.target.value as any)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Semua Status</MenuItem>
          <MenuItem value="true">Aktif</MenuItem>
          <MenuItem value="false">Tidak Aktif</MenuItem>
        </TextField>

        <TextField
          select
          label="Ruangan"
          size="small"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Semua Ruangan</MenuItem>
          {roomOptions.map((r) => (
            <MenuItem key={r.id} value={String(r.id)}>
              {r.name}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setKeyword("");
            setIsActive("");
            setRoomId("");
            onFilter({ keyword: "", isActive: "", roomId: "" });
          }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default RoomBookingsFilter;
