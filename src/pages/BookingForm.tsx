// src/pages/BookingForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BookingForm: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]); // Menyimpan daftar ruangan
  const [selectedRoomId, setSelectedRoomId] = useState<string>(''); // Menyimpan ID ruangan yang dipilih
  const [name, setName] = useState<string>(''); // Nama pemesan
  const [startDate, setStartDate] = useState<string>(''); // Tanggal mulai
  const [endDate, setEndDate] = useState<string>(''); // Tanggal selesai

  useEffect(() => {
    // Ambil data ruangan dari API
    api.get('/rooms')
      .then((response) => {
        setRooms(response.data); // Menyimpan data ruangan
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoomId(event.target.value); // Set ID ruangan berdasarkan pilihan
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Kirim data ke backend sesuai dengan ID ruangan yang dipilih
    const bookingData = {
      roomId: selectedRoomId, // ID ruangan
      name,
      startDate,
      endDate,
    };

    // Kirim ke API untuk peminjaman
    api.post('/roomBookings', bookingData)
      .then((response) => {
        console.log('Booking successful:', response.data);
      })
      .catch((error) => {
        console.error('Booking failed:', error);
      });
  };

  return (
    <div>
      <h1>Form Peminjaman Ruangan</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nama Pemesan:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan Nama Pemesan"
            required
          />
        </div>

        <div>
          <label htmlFor="startDate">Waktu Mulai:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate">Waktu Selesai:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="room">Pilih Ruangan:</label>
          <select
            id="room"
            value={selectedRoomId}
            onChange={handleRoomChange}
            required
          >
            <option value="">Pilih Ruangan</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} {/* Tampilkan nama ruangan di dropdown */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
