import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile, selectFileStatus, selectFileError, clearError } from "./redux/filesSlice";

const FileUpload = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectFileStatus);
  const contextError = useSelector(selectFileError);
  const loading = status === 'loading';
  
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    dispatch(uploadFile(file))
      .unwrap()
      .then(() => {
        setSuccess(true);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      })
      .catch((err) => {
        setError(err || "Upload failed");
      });
  };

  return (
    <Box sx={{ width: "80%", margin: "20px auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Upload Files
      </Typography>
      
      <Paper
        elevation={3}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          padding: 3,
          border: "2px dashed #ccc",
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: "#007ee5",
            backgroundColor: "#f0f7ff"
          },
          mb: 2
        }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input 
          type="file" 
          onChange={handleFileChange} 
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <CloudUploadIcon sx={{ fontSize: 60, color: "#007ee5", mb: 2 }} />
        <Typography variant="body1" gutterBottom>
          {file ? `Selected: ${file.name}` : "Drag & drop files here or click to browse"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supported file types: Images, PDFs, Text files
        </Typography>
      </Paper>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleFileUpload}
        disabled={!file || loading}
        startIcon={<CloudUploadIcon />}
        sx={{ 
          py: 1.2, 
          px: 4, 
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem"
        }}
      >
        {loading ? "Uploading..." : "Upload File"}
      </Button>
      
      {loading && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress />
        </Box>
      )}
      
      <Snackbar 
        open={success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          File uploaded successfully!
        </Alert>
      </Snackbar>
      
      {(error || contextError) && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          onClose={() => {
            setError("");
            if (contextError) dispatch(clearError());
          }}
        >
          {error || contextError}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;