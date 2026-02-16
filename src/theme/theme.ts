import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
    primary: { main: "#071642" },
    background: {
    default: "#F5F7FA",
    paper: "#FFFFFF",
    },
    text: {
    primary: "#111827",
    secondary: "#6B7280",
    },
    divider: "#E5E7EB",
    },
    shape: {
    borderRadius: 10,
    },
    typography: {
    fontFamily: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial"].join(","),
    h6: { fontWeight: 700 },
},
    components: {
    MuiPaper: {
    styleOverrides: {
        root: {
        border: "1px solid #E5E7EB",
        boxShadow: "none", 
        },
    },
    },
    MuiAppBar: {
        styleOverrides: {
        root: {
            boxShadow: "none",
            borderBottom: "1px solid rgba(229,231,235,0.25)",
        },
    },
    },
    MuiButton: {
        styleOverrides: {
        root: {
        textTransform: "none",
        borderRadius: 10,
        },
    },
    },
    MuiTableHead: {
    styleOverrides: {
        root: {
        backgroundColor: "#F3F4F6",
        },
    },
    },
},
});
