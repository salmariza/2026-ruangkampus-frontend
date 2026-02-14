import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';  

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
      </Routes>
    </Router>
  );
};

export default App;
