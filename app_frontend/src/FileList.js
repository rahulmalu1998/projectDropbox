import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteFile, selectFileStatus, fetchFiles } from "./redux/filesSlice";

const FileList = ({ files }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectFileStatus);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteFile(id));
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ width: "80%", margin: "20px auto", textAlign: "center" }}
    >
      <Grid
        item
        xs={12}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          File List
        </Typography>
        {status === "loading" && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Grid>
      {files.map((file, index) => (
        <Paper
          key={file._id || index}
          sx={{
            padding: "10px",
            display: "flex",
            width: "100%",
            alignItems: "center",
            border: "1px solid #ccc",
            mb: 2,
          }}
        >
          <Grid
            container
            display="flex"
            alignItems="center"
            sx={{ display: "flex", flexWrap: { xs: "wrap", sm: "nowrap" } }}
          >
            <Grid item lg={8} md={6} xs={12}>
              <Typography variant="body1">
                {file.originalname || file.name || "Unknown file"} -{" "}
                {file.mimetype || file.type || "Unknown type"}
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
                href={`http://localhost:3000/download/${file.filename}`}
              >
                Download
              </Button>
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
                variant="outlined"
                color="info"
                startIcon={<VisibilityIcon />}
                href={`http://localhost:3000/view/${file._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </Button>
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
      {files.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            No files uploaded yet
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default FileList;
