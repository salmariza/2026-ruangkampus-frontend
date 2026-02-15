import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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

    // validasi simpel
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
    <div>
    <h1>Tambah Ruangan</h1>

    <Link to="/Rooms">← Kembali</Link>

    <form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
            Nama Ruangan
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Auditorium"
            style={{ width: "100%", padding: 8 }}
        />
        </label>

        <label>
            Lokasi
        <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Gedung Pascasarjana Lantai 6"
            style={{ width: "100%", padding: 8 }}
        />
        </label>

        <label>
            Capacity
        <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            style={{ width: "100%", padding: 8 }}
        />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
        />
            Aktif
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: "10px 12px" }}>
            {loading ? "Menyimpan..." : "Simpan"}
        </button>
    </form>
    </div>
    );
};

export default AddRoomPage;
