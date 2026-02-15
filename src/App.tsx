import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';  
import BookingForm from './pages/BookingForm'; 
import AddRoomPage from "./pages/AddRoomPage";
import EditRoomPage from "./pages/EditRoomPage";

const App: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  //const secretKey = process.env.local.REACT_APP_SECRET_KEY;

  console.log(apiUrl); 
  //console.log(secretKey); 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Selamat datang di sistem peminjaman ruangan! 
          <a href="/rooms">Lihat Daftar Ruangan</a></h1>} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/add-room" element={<AddRoomPage />} />
        <Route path="edit-room/:id" element={<EditRoomPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
