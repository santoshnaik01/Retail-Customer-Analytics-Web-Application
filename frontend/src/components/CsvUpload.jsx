
import { useRef, useState } from "react";
import "./CsvUpload.css";

export default function CsvUpload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setFile(null);
    setError("");
    setSuccess("");
    setProgress(0);

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a valid CSV file.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file || uploading) return;

    setError("");
    setSuccess("");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", "http://127.0.0.1:8000/api/upload");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(
              Math.round((event.loaded / event.total) * 100)
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(
              new Error(
                `Upload failed (${xhr.status}). Check the backend endpoint.`
              )
            );
          }
        };

        xhr.onerror = () => {
          reject(new Error("Could not connect to the backend."));
        };

        xhr.send(formData);
      });

      setProgress(100);
      setSuccess("CSV file uploaded successfully.");
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function clearFile() {
    if (uploading) return;

    setFile(null);
    setError("");
    setSuccess("");
    setProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section className="csv-upload">
      <h2>Upload CSV File</h2>
      <p>Select a CSV file to upload your retail dataset.</p>

      <div className="csv-upload__dropzone">
        <label htmlFor="csv-file">Choose a CSV file</label>

        <input
          ref={inputRef}
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {file && (
          <div className="csv-upload__file">
            <strong>Selected file:</strong>
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </div>
        )}

        <div className="csv-upload__actions">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>

          <button
            type="button"
            onClick={clearFile}
            disabled={!file || uploading}
            className="csv-upload__clear"
          >
            Clear file
          </button>
        </div>

        {uploading && (
          <div className="csv-upload__progress">
            <progress value={progress} max="100" />
            <span>{progress}%</span>
          </div>
        )}

        {error && (
          <p className="csv-upload__error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="csv-upload__success" role="status">
            {success}
          </p>
        )}
      </div>
    </section>
  );
}
