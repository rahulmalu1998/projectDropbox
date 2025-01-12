import React, { useState, useEffect } from "react";
import "./App.css";
import FileList from "./FileList";
import FileUpload from "./FileUpload";
import DropboxIcon from "@mui/icons-material/Cloud";
import Box from "@mui/material/Box";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);

  const fetchFiles = () => {
    axios
      .get("http://localhost:3000/files")
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the files!", error);
      });
  };
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DropboxIcon style={{ fontSize: 100, color: "#007ee5" }} />
          <h1>Dropbox</h1>
        </Box>
        <FileUpload onUpload={fetchFiles} />
        <FileList files={files} onDelete={fetchFiles} />
      </header>
    </div>
  );
}

export default App;
