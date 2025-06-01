import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(() => {
    setLoading(true);
    setError(null);
    
    return axios.get("http://localhost:3000/files")
      .then((response) => {
        setFiles(response.data);
        return response.data;
      })
      .catch((error) => {
        setError("Failed to fetch files");
        console.error("There was an error fetching the files!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const uploadFile = useCallback((file) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    
    return axios.post("http://localhost:3000/upload", formData)
      .then((response) => {
        fetchFiles();
        return response;
      })
      .catch((error) => {
        setError("Upload failed");
        console.error("There was an error uploading the file!", error);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchFiles]);

  const deleteFile = useCallback((id) => {
    setLoading(true);
    
    return axios.delete(`http://localhost:3000/files/${id}`)
      .then((response) => {
        fetchFiles();
        return response;
      })
      .catch((error) => {
        setError("Delete failed");
        console.error("There was an error deleting the file!", error);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchFiles]);

  return (
    <FileContext.Provider value={{ 
      files, 
      loading, 
      error, 
      fetchFiles, 
      uploadFile, 
      deleteFile 
    }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => useContext(FileContext);