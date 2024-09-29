import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const InvBulk = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);

        try {
            // Get the authentication token (replace with your actual token retrieval logic)
            const token = localStorage.getItem('authToken'); 

            // Set the token in the Authorization header
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Use "Bearer" for Sanctum
                    'Content-Type': 'multipart/form-data' 
                }
            };

            const response = await axios.post('/api/inventory/bulk-upload', formData, config);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading file');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Upload CSV
            </Typography>
            <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mb: 2 }}
            >
                Select File
                <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
            {selectedFile && (
                <Typography variant="body1" gutterBottom>
                    Selected file: {selectedFile.name}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </Button>
            {message && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default InvBulk;
