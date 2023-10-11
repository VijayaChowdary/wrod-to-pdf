import React, { useState } from 'react';
import './Style.css';

function WordToPDFConverter() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const convertToPDF = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Send the Word document to the server for conversion
    fetch('http://localhost:3001/convert', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.blob())
      .then(blob => {
        // Handle the response, which is the converted PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.pdf';
        a.click();
      })
      .catch(error => console.error(error));
    
  };

  return (
    <div className="container">
      <h1>Word to PDF Converter</h1>
      <div className="file-input">
        <input type="file" accept=".docx" onChange={handleFileChange} id="file-input" />
        <label htmlFor="file-input">Choose Word File</label>
      </div>
      {file && (
        <div className="file-info">
          Selected File: {file.name}
        </div>
      )}
      <button className="convert-button" onClick={convertToPDF}>
        Convert to PDF
      </button>
    </div>
  );
}

export default WordToPDFConverter;
