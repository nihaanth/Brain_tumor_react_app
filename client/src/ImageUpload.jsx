import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onPrediction }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', image); // Ensure the key matches the server's expected key

      setUploading(true);

      try {
        const response = await axios.post('http://localhost:3000/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && response.data.prediction !== undefined) {
          onPrediction(response.data);
        } else if (response.data && response.data.error) {
          console.error('Server error:', response.data.error);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <div>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '500px', height: '400px' }}
          />
        </div>
      )}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ImageUpload;