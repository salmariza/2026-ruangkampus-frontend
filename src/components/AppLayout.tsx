import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";

const HEADER_H = 72;

const NavButton: React.FC<{ to: string; label: string }> = ({ to, label }) => {
const { pathname } = useLocation();
const active = pathname === to;

return (
    <Button
        component={RouterLink}
        to={to}
        color="inherit"
        sx={{
        px: 1.5,
        opacity: active ? 1 : 0.85,
        borderBottom: active ? "2px solid rgba(255,255,255,0.85)" : "2px solid transparent",
        borderRadius: 0,
        "&:hover": { opacity: 1, borderBottomColor: "rgba(255,255,255,0.85)" },
    }}
    >
        {label}
    </Button>
    );
};

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <AppBar position="fixed" color="primary">
        <Toolbar sx={{ height: HEADER_H }}>
        <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <Typography variant="h6" sx={{ color: "common.white" }}>
                RuangKampus
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Sistem Manajemen Ruangan Kampus
            </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", gap: 0.5 }}>
            <NavButton to="/rooms" label="Rooms" />
            <NavButton to="/room-bookings" label="Bookings" />
        </Box>
        </Toolbar>
    </AppBar>

    <Box sx={{ height: HEADER_H }} />

    <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
    </Container>
    </Box>
);
};

export default AppLayout;
