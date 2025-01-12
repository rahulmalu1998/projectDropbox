import React from "react";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Grid, Paper, Typography } from "@mui/material";
const FileList = ({ files, onDelete }) => {
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/files/${id}`)
      .then((res) => {
        alert("File deleted successfully");
        onDelete(); // Refresh the file list after deletion
      })
      .catch((error) => {
        console.error("There was an error deleting the file!", error);
      });
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ width: "80%", margin: "20px auto", textAlign: "center" }}
    >
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          File List
        </Typography>
      </Grid>
      {files.map((file, index) => (
        <Paper
          sx={{
            padding: "10px",
            display: "flex",
            width: "100%",
            //   justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ccc",
          }}
        >
          <Grid
            container
            key={index}
            display="flex"
            alignItems="center"
            sx={{ mb: "1", flexWrap: { xs: "wrap", sm: "nowrap" } }}
          >
            <Grid item lg={8} md={6} xs={12}>
              <Typography variant="body1">
                {file.originalname} - {file.mimetype}
              </Typography>
            </Grid>
            <Grid
              item
              lg={2}
              md={3}
              xs={6}
              direction="column"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                href={`http://localhost:3000/download/${file._id}`}
              >
                Download
              </Button>
            </Grid>
            <Grid
              item
              lg={2}
              md={6}
              xs={6}
              direction="column"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(file._id)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Grid>
  );
};

export default FileList;
