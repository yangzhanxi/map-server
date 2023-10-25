import React from 'react';

function FileUpload() {
  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append('mapFile', e.target.files[0]);

    await fetch('http://localhost:58885/import-map', {
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
