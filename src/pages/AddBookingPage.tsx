import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

type Room = {
  id: number;
  name: string;
  isActive: boolean;
};

const AddBookingPage: React.FC = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState<number | "">("");

  const [bookerName, setBookerName] = useState("");
  const [purposeOfBooking, setPurposeOfBooking] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/Rooms");
        // optional: cuma tampilkan room yang aktif
        const activeRooms = (res.data as Room[]).filter((r) => r.isActive);
        setRooms(activeRooms);
      } catch (e) {
        console.error(e);
        setError("Gagal fetch daftar ruangan.");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // validasi simpel
    if (!roomId) return setError("Pilih ruangan dulu.");
    if (!bookerName.trim()) return setError("Nama peminjam wajib diisi.");
    if (!purposeOfBooking.trim()) return setError("Tujuan peminjaman wajib diisi.");
    if (!startTime) return setError("Start time wajib diisi.");
    if (!endTime) return setError("End time wajib diisi.");

    // optional: validasi start < end di FE
    const st = new Date(startTime).getTime();
    const et = new Date(endTime).getTime();
    if (!Number.isNaN(st) && !Number.isNaN(et) && st >= et) {
      return setError("StartTime harus lebih kecil dari EndTime.");
    }

    try {
      setSaving(true);

      await api.post("/RoomBookings", {
      roomId: Number(roomId),
      bookerName: bookerName.trim(),
      purposeOfBooking: purposeOfBooking.trim(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      status: "Pending",  
    });

      navigate("/room-bookings");
    } catch (e: any) {
      console.error(e);
      // backend kamu suka balikin BadRequest kalau bentrok, jadi tampilkan pesannya kalau ada
      const msg = e?.response?.data ?? "Gagal membuat booking.";
      setError(typeof msg === "string" ? msg : "Gagal membuat booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Buat Booking Ruangan</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Link to="/room-bookings">← Kembali</Link>
      </div>

      {loadingRooms ? (
        <p>Loading rooms...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 480 }}>
          <label>
            Pilih Ruangan
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : "")}
              style={{ width: "100%", padding: 8 }}
            >
              <option value="">-- pilih ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nama Peminjam
            <input
              value={bookerName}
              onChange={(e) => setBookerName(e.target.value)}
              placeholder="Contoh: Salma"
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Tujuan Peminjaman
            <input
              value={purposeOfBooking}
              onChange={(e) => setPurposeOfBooking(e.target.value)}
              placeholder="Contoh: Rapat UKM"
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Waktu Mulai
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Waktu Selesai
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <button type="submit" disabled={saving} style={{ padding: "10px 12px" }}>
            {saving ? "Menyimpan..." : "Buat Booking"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddBookingPage;
