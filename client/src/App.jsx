import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setText(response.data);
      setError('');
    } catch (err) {
      setText('');
      setError('Error uploading or parsing PDF');
    }
  };

  return (
    <div className="App">
      <h1>AI Resume Roaster</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="application/pdf" required />
        <button type="submit">Upload</button>

      </form>
      {error && <p className="error">{error}</p>}
      <div className='markdown'>
      <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;
