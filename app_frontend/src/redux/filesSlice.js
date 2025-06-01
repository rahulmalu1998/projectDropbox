import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/files");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch files");
    }
  }
);

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData
      );
      await dispatch(fetchFiles()).unwrap();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Upload failed");
    }
  }
);

// this function deletes a file
export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (fileId, { dispatch, rejectWithValue }) => {
    try {
      // delete the file from the server
      await axios.delete(`http://localhost:3000/files/${fileId}`);
      // get all the files again
      await dispatch(fetchFiles()).unwrap();
      // return the file id
      return fileId;
    } catch (error) {
      // if there is an error, return it
      return rejectWithValue(error.message || "Delete failed");
    }
  }
);

// create the slice
const filesSlice = createSlice({
  name: "files",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // clear the error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // when fetching files starts
      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // when fetching files is successful
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      // when fetching files fails
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // when uploading a file starts
      .addCase(uploadFile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // when uploading a file is successful
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      // when uploading a file fails
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // when deleting a file starts
      .addCase(deleteFile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // when deleting a file is successful
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      // when deleting a file fails
      .addCase(deleteFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = filesSlice.actions;

export const selectFiles = (state) => state.files.items;
export const selectFileStatus = (state) => state.files.status;
export const selectFileError = (state) => state.files.error;

export default filesSlice.reducer;
