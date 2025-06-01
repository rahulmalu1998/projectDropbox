import React, { useEffect } from "react";
import "./App.css";
import FileList from "./FileList";
import FileUpload from "./FileUpload";
import DropboxIcon from "@mui/icons-material/Cloud";
import { Box, Container, Paper, Typography, Divider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles, selectFiles } from "./redux/filesSlice";

function App() {
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);

  // create a theme
  const theme = createTheme({
    typography: {
      fontFamily: "'Montserrat', sans-serif",
      h3: {
        fontWeight: 800,
      },
      subtitle1: {
        fontWeight: 400,
      },
    },
  });

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh", // make it full height
          background: "linear-gradient(135deg, #e3f2fd 0%, #f4f6f8 100%)", // nice gradient
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <DropboxIcon sx={{ fontSize: 90, color: "#007ee5" }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 800, mt: 1, letterSpacing: 1 }}
              >
                Dropbox
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "text.secondary", mt: 1 }}
              >
                Simple cloud file storage
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <FileUpload />
            <Divider sx={{ my: 3 }} />
            <FileList files={files} />
          </Paper>
        </Container>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          py: 2,
          color: "text.secondary",
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} Dropbox by Rahul Malu
      </Box>
    </ThemeProvider>
  );
}

export default App;
