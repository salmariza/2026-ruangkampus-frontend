// src/pages/RoomListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RoomBookingsFilter from '../components/RoomBookingsFilter'; // Import komponen filter

const RoomListPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]); // State untuk data ruangan yang sudah difilter

  useEffect(() => {
    api.get('/rooms') // Ambil data ruangan
      .then((response) => {
        setRooms(response.data);
        setFilteredRooms(response.data); // Set filteredRooms dengan data ruangan awal
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch rooms');
        setLoading(false);
      });
  }, []);

  const filterRooms = (status: string, room: string, date: string) => {
    let filtered = rooms;

    // Filter berdasarkan status
    if (status) {
      filtered = filtered.filter((room) => room.status === status);
    }

    // Filter berdasarkan ruangan
    if (room) {
      filtered = filtered.filter((room) => room.name === room);
    }

    // Filter berdasarkan tanggal (optional)
    if (date) {
      filtered = filtered.filter((room) => room.date === date);
    }

    setFilteredRooms(filtered); // Set hasil filter ke state filteredRooms
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Daftar Ruangan</h1>
      <Link to="/booking">Peminjaman Ruangan</Link> {/* Link ke Booking Form */}
      
      {/* Filter untuk pencarian */}
      <RoomBookingsFilter onFilter={filterRooms} />

      {filteredRooms.length > 0 ? (
        <ul>
          {filteredRooms.map((room: any) => (
            <li key={room.id}>
              <h2>{room.name}</h2>
              <p>Lokasi: {room.location}</p>
              <p>Kapasitas: {room.capacity}</p>
              <p>Status: {room.isActive ? 'Aktif' : 'Tidak Aktif'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada ruangan yang tersedia.</p>
      )}
    </div>
  );
};

export default RoomListPage;
