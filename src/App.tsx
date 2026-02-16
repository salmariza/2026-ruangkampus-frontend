import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';
import AddBookingPage from './pages/AddBookingPage';
import AddRoomPage from "./pages/AddRoomPage";
import EditRoomPage from "./pages/EditRoomPage";
import RoomBookingsPage from "./pages/RoomBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
import AppLayout from "./components/AppLayout";
import { Box, Paper, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const App: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route
            path="/"
            element={
              <Paper sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Selamat datang di RuangKampus
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Sistem Peminjaman Ruangan Kampus
                </Typography>
                <Button
                  component={RouterLink}
                  to="/rooms"
                  variant="contained"
                  color="primary"
                >
                  Lihat Daftar Ruangan
                </Button>
              </Paper>
            }
          />

          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/add-booking" element={<AddBookingPage />} />
          <Route path="/add-room" element={<AddRoomPage />} />
          <Route path="edit-room/:id" element={<EditRoomPage />} />
          <Route path="room-bookings" element={<RoomBookingsPage />} />
          <Route path="edit-booking/:id" element={<EditBookingPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
