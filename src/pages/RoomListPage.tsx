import React, { useEffect, useState } from 'react';
import api from '../services/api';  

const RoomListPage: React.FC = () => {
const [rooms, setRooms] = useState<any[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    api.get('/rooms')
        .then((response) => {
        setRooms(response.data);
        setLoading(false);
    })
    .catch((error) => {
        setError('Failed to fetch rooms');
        setLoading(false);
    });
}, []);

    if (loading) {
    return <p>Loading...</p>; // Menampilkan loading state
    }

    if (error) {
    return <p>{error}</p>; // Menampilkan error jika ada
    }

    return (
    <div>
        <h1>Daftar Ruangan</h1>
        {rooms.length > 0 ? (
        <ul>
            {rooms.map((room: any) => (
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
