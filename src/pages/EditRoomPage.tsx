import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

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

    // validasi simpel
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

  if (loading) return <p>Loading...</p>;
  if (error && !room) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!room) return <p>Data ruangan tidak ditemukan.</p>;

  return (
    <div>
      <h1>Edit Ruangan</h1>
      <Link to="/rooms">← Kembali</Link>

      <form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
          Nama Ruangan
          <input
            value={room.name}
            onChange={(e) => setRoom({ ...room, name: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Lokasi
          <input
            value={room.location}
            onChange={(e) => setRoom({ ...room, location: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Capacity
          <input
            type="number"
            value={room.capacity}
            onChange={(e) => setRoom({ ...room, capacity: Number(e.target.value) })}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={room.isActive}
            onChange={(e) => setRoom({ ...room, isActive: e.target.checked })}
          />
          Aktif
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={saving} style={{ padding: "10px 12px" }}>
          {saving ? "Menyimpan..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditRoomPage;
