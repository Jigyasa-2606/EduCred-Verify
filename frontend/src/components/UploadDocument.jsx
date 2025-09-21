import { useState } from "react";
import axios from "axios";

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    setLoading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await axios.post("http://localhost:5000/verify", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg mt-8">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded w-full"
      >
        {loading ? "Verifying..." : "Verify Document"}
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Details:</strong> {result.details}</p>
        </div>
      )}
    </div>
  );
}
