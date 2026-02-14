import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';  

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Selamat datang di sistem peminjaman ruangan!</h1>} />
        <Route path="/rooms" element={<RoomListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
