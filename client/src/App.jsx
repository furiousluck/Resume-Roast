import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Analytics } from '@vercel/analytics/react'; 
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        "https://goldfish-app-nvg3l.ondigitalocean.app/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setText(response.data);
      setError("");
    } catch (err) {
      setText("");
      setError("Error uploading or parsing PDF");
    }
    setIsLoading(false); // Stop loading
  };

  return (
    <div className="App">
      <h1>AI Resume Roaster💼</h1>
      <h3>Want to get roasted and get opinion, you are at right place 🥴</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf"
          required
        />
        {isLoading ? (
          <button type="submit" disabled>
            <i className="fa fa-spinner fa-spin"></i> Uploading...
          </button>
        ) : (
          <button type="submit">Upload</button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <div className="markdown">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
