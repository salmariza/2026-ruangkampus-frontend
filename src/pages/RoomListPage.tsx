import React, { useEffect, useState } from 'react';
import api from '../api';

const RoomListPage: React.FC = () => {
const [rooms, setRooms] = useState<any[]>([]);

useEffect(() => {
    api.get('/rooms')
    .then(response => {
        setRooms(response.data);
    })
    .catch(error => {
        console.error('There was an error fetching the rooms!', error);
    });
}, []);

return (
    <div>
        <h1>Daftar Ruangan</h1>
        {rooms.length > 0 ? (
        <ul>
            {rooms.map((room: any) => (
            <li key={room.id}>
            {room.name} - {room.location} - Kapasitas: {room.capacity} - Status: {room.isActive ? 'Aktif' : 'Tidak Aktif'}
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
