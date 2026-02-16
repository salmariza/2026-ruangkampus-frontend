import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRooms, getRoomBookingById, updateRoomBooking, BookingStatusText } from "../services/api";

type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
};

const toInputValue = (iso: string) => {
  // ISO -> "YYYY-MM-DDTHH:mm" (buat input type=datetime-local)
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const toIsoFromInput = (value: string) => {
  // "YYYY-MM-DDTHH:mm" -> ISO
  // new Date(value) akan treat sebagai local time lalu jadi ISO UTC.
  // Ini udah cukup buat tugas kamu.
  const d = new Date(value);
  return d.toISOString();
};

const EditBookingPage: React.FC = () => {
  const { id } = useParams();
  const bookingId = Number(id);
  const nav = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // form state
  const [roomId, setRoomId] = useState<number>(0);
  const [bookerName, setBookerName] = useState("");
  const [purposeOfBooking, setPurposeOfBooking] = useState("");
  const [startTime, setStartTime] = useState(""); // datetime-local value
  const [endTime, setEndTime] = useState("");     // datetime-local value
  const [status, setStatus] = useState<BookingStatusText>("Pending");

  const activeRooms = useMemo(() => rooms.filter((r) => r.isActive), [rooms]);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!bookingId || Number.isNaN(bookingId)) {
          setError("ID booking tidak valid.");
          return;
        }

        const [roomsData, booking] = await Promise.all([
          getRooms(),
          getRoomBookingById(bookingId),
        ]);

        setRooms(roomsData);

        setRoomId(booking.roomId);
        setBookerName(booking.bookerName ?? "");
        setPurposeOfBooking(booking.purposeOfBooking ?? "");
        setStartTime(toInputValue(booking.startTime));
        setEndTime(toInputValue(booking.endTime));

        // status dari backend biasanya string: "Pending"/"Approved"/"Rejected"
        const s = (booking.status ?? "Pending") as BookingStatusText;
        setStatus(s);
      } catch (e: any) {
        console.error(e);
        setError("Gagal memuat data booking.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId) return setError("Pilih ruangan dulu.");
    if (!bookerName.trim()) return setError("Nama peminjam wajib diisi.");
    if (!purposeOfBooking.trim()) return setError("Tujuan peminjaman wajib diisi.");
    if (!startTime || !endTime) return setError("Waktu mulai & selesai wajib diisi.");

    const startIso = toIsoFromInput(startTime);
    const endIso = toIsoFromInput(endTime);

    if (new Date(startIso) >= new Date(endIso)) {
      return setError("Waktu selesai harus lebih besar dari waktu mulai.");
    }

    try {
      setSaving(true);
      setError(null);

      await updateRoomBooking(bookingId, {
        roomId,
        bookerName: bookerName.trim(),
        purposeOfBooking: purposeOfBooking.trim(),
        startTime: startIso,
        endTime: endIso,
        status,
      });

      nav("/room-bookings");
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data ||
        e?.message ||
        "Gagal menyimpan perubahan booking.";
      setError(typeof msg === "string" ? msg : "Gagal menyimpan perubahan booking.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <h1>Edit Booking</h1>

      <div style={{ marginBottom: 12 }}>
        <Link to="/room-bookings">← Kembali</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <div>
          <label>Pilih Ruangan</label>
          <br />
          <select value={roomId} onChange={(e) => setRoomId(Number(e.target.value))}>
            <option value={0}>-- Pilih Ruangan --</option>
            {activeRooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Nama Peminjam</label>
          <br />
          <input value={bookerName} onChange={(e) => setBookerName(e.target.value)} />
        </div>

        <div>
          <label>Tujuan Peminjaman</label>
          <br />
          <input value={purposeOfBooking} onChange={(e) => setPurposeOfBooking(e.target.value)} />
        </div>

        <div>
          <label>Waktu Mulai</label>
          <br />
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>

        <div>
          <label>Waktu Selesai</label>
          <br />
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div>
          <label>Status</label>
          <br />
          <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatusText)}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default EditBookingPage;
