import React, { useState } from 'react';
import api from '../services/api'; 

const BookingForm: React.FC = () => {
const [roomId, setRoomId] = useState<number | string>('');
const [bookerName, setBookerName] = useState('');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [status, setStatus] = useState('Pending');
const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookingData = { roomId, bookerName, startTime, endTime, status };

    try {
        await api.post('/roombookings', bookingData); 
        setMessage('Booking berhasil dilakukan!');
    } catch (error) {
        setMessage('Gagal melakukan booking. Coba lagi.');
    }
    };

    return (
    <div>
    <h1>Form Peminjaman Ruangan</h1>
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="roomId">Ruangan:</label>
            <input
            type="number"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            required
        />
        </div>
        <div>
            <label htmlFor="bookerName">Nama Pemesan:</label>
            <input
            type="text"
            id="bookerName"
            value={bookerName}
            onChange={(e) => setBookerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startTime">Waktu Mulai:</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
        />
        </div>
        <div>
            <label htmlFor="endTime">Waktu Selesai:</label>
                <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
            />
        </div>
        <div>
            <button type="submit">Booking</button>
        </div>
    </form>
    {message && <p>{message}</p>}
    </div>
);
};

export default BookingForm;
