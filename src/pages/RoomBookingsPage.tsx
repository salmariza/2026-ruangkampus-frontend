import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const RoomBookingsPage: React.FC = () => {
const [bookings, setBookings] = useState<RoomBooking[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const fetchBookings = async () => {
    try {
    setError(null);
      const res = await api.get("/RoomBookings"); // GET all bookings
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

if (loading) return <p>Loading...</p>;
if (error) return <p style={{ color: "crimson" }}>{error}</p>;

return (
    <div>
    <h1>Daftar Peminjaman Ruangan</h1>

    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <Link to="/rooms">← Kembali ke Rooms</Link>
        <Link to="/add-booking">
        <button>Buat Booking</button>
        </Link>
    </div>

    {bookings.length > 0 ? (
        <table>
        <thead>
            <tr>
            <th>ID</th>
            <th>RoomId</th>
            <th>Nama Peminjam</th>
            <th>Tujuan</th>
            <th>Mulai</th>
            <th>Selesai</th>
            <th>Status</th>
            <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            {bookings.map((b) => (
            <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.roomId}</td>
                <td>{b.bookerName}</td>
                <td>{b.purposeOfBooking}</td>
                <td>{formatDT(b.startTime)}</td>
                <td>{formatDT(b.endTime)}</td>
                <td>{b.status}</td>
                <td style={{ display: "flex", gap: 8 }}>
                <Link to={`/edit-booking/${b.id}`}>
                    <button>Edit</button>
                    </Link>
                <button onClick={() => handleDelete(b.id)}>Hapus</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    ) : (
        <p>Belum ada booking.</p>
    )}
    </div>
);
};

export default RoomBookingsPage;
