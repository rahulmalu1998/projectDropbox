import React, { useState } from "react";
import axios from "axios";
//styled components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:3000/upload", formData)
      .then((response) => {
        alert("File uploaded successfully");
        onUpload(); // Call the callback function to refresh the file list
      })
      .catch((error) => {
        console.error("There was an error uploading the file!", error);
        setError(error.response);
      });
  };

  return (
    <Box sx={{ width: "80%", margin: "20px auto", textAlign: "center" }}>
      {" "}
      {/* <h1>Upload File</h1> */}
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleFileUpload}>
        Upload
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default FileUpload;
