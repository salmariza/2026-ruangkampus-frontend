import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';  
import AddBookingPage from './pages/AddBookingPage'; 
import AddRoomPage from "./pages/AddRoomPage";
import EditRoomPage from "./pages/EditRoomPage";
import RoomBookingsPage from "./pages/RoomBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
const App: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  //const secretKey = process.env.local.REACT_APP_SECRET_KEY;

  console.log(apiUrl); 
  //console.log(secretKey); 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Selamat datang di RuangKampus: Sistem Peminjaman Ruangan! 
          <a href="/rooms">Lihat Daftar Ruangan</a></h1>} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/add-booking" element={<AddBookingPage />} />
        <Route path="/add-room" element={<AddRoomPage />} />
        <Route path="edit-room/:id" element={<EditRoomPage/>}/>
        <Route path="room-bookings" element={<RoomBookingsPage/>}/>
        <Route path="edit-booking/:id" element={<EditBookingPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
