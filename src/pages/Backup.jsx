import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BackupRestore = () => {
  const token = localStorage.getItem("token");

  const [backupLoading, setBackupLoading] = useState(false);

  const [restoreFile, setRestoreFile] = useState(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/backup/backup`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `backup_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error during backup:", err);
      alert("Gagal melakukan backup data.");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRestoreFile(e.target.files[0]);
    }
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    if (!restoreFile) {
      alert("Silakan pilih file Excel untuk restore data.");
      return;
    }
    setRestoreLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", restoreFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/backup/restore`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Restore data berhasil: " + response.data.message);
    } catch (err) {
      console.error("Error during restore:", err);
      alert("Gagal melakukan restore data.");
    } finally {
      setRestoreLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Backup & Restore Data</h2>
          <div className="mb-8 border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Backup Data</h3>
            <p className="mb-4">
              Tekan tombol di bawah ini untuk mendownload seluruh data yang ada
              di database dalam bentuk file Excel. File backup akan menyertakan
              seluruh data termasuk foto meteran (dalam bentuk URL).
            </p>
            <button
              onClick={handleBackup}
              disabled={backupLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {backupLoading ? "Memproses..." : "Backup Data"}
            </button>
          </div>
          <div className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Restore Data</h3>
            <p className="mb-4">
              Pilih file Excel yang telah Anda backup untuk mengembalikan data.
            </p>
            <form onSubmit={handleRestore}>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleRestoreFileChange}
                className="mb-4"
              />
              <br />
              <button
                type="submit"
                disabled={restoreLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {restoreLoading ? "Memproses..." : "Restore Data"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
