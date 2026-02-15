// src/components/RoomBookingsFilter.tsx
import React, { useEffect, useMemo, useState } from "react";

type Room = {
  id: number;
  name: string;
};

type Props = {
  rooms: Room[]; // daftar room buat dropdown (id + name)
  onFilter: (filters: { keyword: string; isActive: "" | "true" | "false"; roomId: "" | string }) => void;
};

const RoomBookingsFilter: React.FC<Props> = ({ rooms, onFilter }) => {
  const [keyword, setKeyword] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [roomId, setRoomId] = useState<"" | string>("");

  // biar gak spam onFilter tiap ketik 1 huruf (optional tapi enak)
  useEffect(() => {
    const t = setTimeout(() => {
      onFilter({ keyword, isActive, roomId });
    }, 250);

    return () => clearTimeout(t);
  }, [keyword, isActive, roomId, onFilter]);

  const roomOptions = useMemo(() => rooms ?? [], [rooms]);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "12px 0" }}>
      <input
        type="text"
        placeholder="Cari nama ruangan / lokasi..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: 8, minWidth: 240 }}
      />

      <select value={isActive} onChange={(e) => setIsActive(e.target.value as any)} style={{ padding: 8 }}>
        <option value="">Semua Status</option>
        <option value="true">Aktif</option>
        <option value="false">Tidak Aktif</option>
      </select>

      <select value={roomId} onChange={(e) => setRoomId(e.target.value)} style={{ padding: 8 }}>
        <option value="">Semua Ruangan</option>
        {roomOptions.map((r) => (
          <option key={r.id} value={String(r.id)}>
            {r.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => {
          setKeyword("");
          setIsActive("");
          setRoomId("");
          onFilter({ keyword: "", isActive: "", roomId: "" });
        }}
        style={{ padding: "8px 12px" }}
      >
        Reset
      </button>
    </div>
  );
};

export default RoomBookingsFilter;
