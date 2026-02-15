import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import RoomBookingsFilter from "../components/RoomBookingsFilter";

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

  // filteredRooms dihitung dari rooms + filters, bukan diset manual
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // keyword filter: name/location
    const kw = filters.keyword.trim().toLowerCase();
    if (kw) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(kw) ||
          r.location.toLowerCase().includes(kw)
      );
    }

    // status filter
    if (filters.isActive) {
      const active = filters.isActive === "true";
      result = result.filter((r) => r.isActive === active);
    }

    // roomId filter (kalau kamu memang butuh)
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Daftar Ruangan</h1>

      <Link to="/add-room">
        <button>Tambah Ruangan</button>
      </Link>

      <RoomBookingsFilter
        rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
        onFilter={(f) => setFilters(f)}
      />

      {filteredRooms.length > 0 ? (
    
        <table>
          <thead>
            <tr>
              <th>Nama Ruangan</th>
              <th>Kapasitas</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>{room.location}</td>
                <td>{room.isActive ? "Aktif" : "Tidak Aktif"}</td>
                <td>
                  <Link to={`/edit-room/${room.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(room.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Belum ada ruangan yang tersedia.</p>
      )}

      <Link to="/room-bookings">
        <button>Go to Room Bookings</button>
      </Link>
    </div>
  );
};

export default RoomListPage;
