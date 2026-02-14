// src/components/RoomBookingsFilter.tsx
import React, { useState, useEffect } from 'react';
import { getRoomBookingsByStatus, getRoomBookingsByRoom, getRoomBookingsByDate } from '../services/api';

const RoomBookingsFilter = () => {
const [statuses, setStatuses] = useState<string[]>([]);
const [rooms, setRooms] = useState<string[]>([]);
const [dates, setDates] = useState<string[]>([]);
const [selectedStatus, setSelectedStatus] = useState<string>('');
const [selectedRoom, setSelectedRoom] = useState<string>('');
const [selectedDate, setSelectedDate] = useState<string>('');

useEffect(() => {
    // Fetch status, room, and date data from the backend
    const fetchData = async () => {
    try {
        const statusesData = await getRoomBookingsByStatus();
        setStatuses(statusesData);
        const roomsData = await getRoomBookingsByRoom();
        setRooms(roomsData);
        const datesData = await getRoomBookingsByDate();
        setDates(datesData);
    } catch (error) {
        console.error("Error fetching filter data:", error);
    }
    };
    fetchData();
}, []);

const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
};

const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoom(event.target.value);
};

const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
};

    return (
    <div>
    <h3>Filter Room Bookings</h3>
    <select value={selectedStatus} onChange={handleStatusChange}>
        <option value="">Select Status</option>
        {statuses.map((status, index) => (
        <option key={index} value={status}>
            {status}
        </option>
        ))}
    </select>

    <select value={selectedRoom} onChange={handleRoomChange}>
        <option value="">Select Room</option>
        {rooms.map((room, index) => (
        <option key={index} value={room}>
            {room}
        </option>
        ))}
    </select>

    <select value={selectedDate} onChange={handleDateChange}>
        <option value="">Select Date</option>
        {dates.map((date, index) => (
        <option key={index} value={date}>
            {date}
        </option>
        ))}
        </select>
    </div>
);
};

export default RoomBookingsFilter;
