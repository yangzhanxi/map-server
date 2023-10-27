import React from 'react';
import {UPLOAD_FILE} from './constants'

function FileUpload() {
  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append('mapFile', e.target.files[0]);

    await fetch(UPLOAD_FILE, {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUpload;
