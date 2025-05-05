// src/pages/TarifManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";

const TarifManagement = () => {
  const token = localStorage.getItem("token");

  // State untuk menyimpan data tarif, loading, dan ID yang sedang di-edit
  const [tarifs, setTarifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("");

  // Form data untuk penambahan/perubahan tarif
  const [formData, setFormData] = useState({
    jenis_pelayanan: "",
    tarif_dasar: "",
    denda: "",
    efektif_dari: "",
    efektif_sampai: "",
    keterangan: "",
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Ambil data tarif dari backend
  const fetchTarifs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tarif_penggunaan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarifs(res.data);
    } catch (err) {
      console.error("Error fetching tarifs:", err);
      showNotification("Gagal mengambil data tarif", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifs();
  }, []);

  // State untuk notifikasi
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  // Tampilkan notifikasi
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Handler untuk perubahan form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form untuk menambahkan atau memperbarui tarif
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update tarif yang sudah ada
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tarif_penggunaan/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Tarif berhasil diperbarui");
      } else {
        // Buat tarif baru
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/tarif_penggunaan`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Tarif baru berhasil ditambahkan");
      }
      // Reset form dan fetch data ulang
      resetForm();
      fetchTarifs();
    } catch (err) {
      console.error("Error saving tarif:", err);
      showNotification("Gagal menyimpan tarif", "error");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      jenis_pelayanan: "",
      tarif_dasar: "",
      denda: "",
      efektif_dari: "",
      efektif_sampai: "",
      keterangan: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Handler untuk mulai mengedit tarif: Isi form dengan data dari tarif yang dipilih
  const handleEdit = (tarif) => {
    setEditingId(tarif.id);
    setFormData({
      jenis_pelayanan: tarif.jenis_pelayanan,
      tarif_dasar: tarif.tarif_dasar,
      denda: tarif.denda,
      efektif_dari: tarif.efektif_dari,
      efektif_sampai: tarif.efektif_sampai || "",
      keterangan: tarif.keterangan || "",
    });
    setIsFormOpen(true);
  };

  // Handler untuk menghapus tarif
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tarif ini?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/tarif_penggunaan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Tarif berhasil dihapus");
        fetchTarifs();
      } catch (err) {
        console.error("Error deleting tarif:", err);
        showNotification("Gagal menghapus tarif", "error");
      }
    }
  };

  // Filter tarif berdasarkan pencarian dan filter
  const filteredTarifs = tarifs.filter(tarif => {
    const matchesSearch = searchTerm === "" || 
      tarif.jenis_pelayanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarif.keterangan?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterService === "" || tarif.jenis_pelayanan === filterService;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen w-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 mx-auto container">
          {/* Page header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Pengaturan Tarif Penggunaan</h2>
            <p className="text-gray-600">Kelola tarif layanan air untuk berbagai jenis pelayanan</p>
          </div>

          {/* Notification component */}
          {notification.visible && (
            <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white`}>
              {notification.message}
            </div>
          )}

          {/* Action buttons and search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-md"
              >
                <FaPlus className="mr-2" />
                Tambah Tarif Baru
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari tarif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Jenis</option>
                <option value="Reguler">Reguler</option>
                <option value="Subsidi">Subsidi</option>
              </select>
            </div>
          </div>

          {/* Form tambah/update tarif in modal */}
          {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingId ? "Perbarui Tarif" : "Tambah Tarif Baru"}
                  </h3>
                  <button 
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pelayanan</label>
                      <select
                        name="jenis_pelayanan"
                        value={formData.jenis_pelayanan}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Pilih Jenis Pelayanan</option>
                        <option value="Reguler">Reguler</option>
                        <option value="Subsidi">Subsidi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarif Dasar (Rp)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="tarif_dasar"
                        value={formData.tarif_dasar}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Denda (Rp)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="denda"
                        value={formData.denda}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Efektif Dari</label>
                      <input
                        type="date"
                        name="efektif_dari"
                        value={formData.efektif_dari}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Efektif Sampai</label>
                      <input
                        type="date"
                        name="efektif_sampai"
                        value={formData.efektif_sampai}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Opsional"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                      <textarea
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Opsional"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                    >
                      <FaSave className="mr-2" />
                      {editingId ? "Perbarui" : "Simpan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabel daftar tarif */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Daftar Tarif Penggunaan</h3>
            </div>
            {loading ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTarifs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pelayanan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarif Dasar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denda</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode Efektif</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTarifs.map((tarif) => (
                      <tr key={tarif.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tarif.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tarif.jenis_pelayanan === 'Reguler' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {tarif.jenis_pelayanan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(tarif.tarif_dasar)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(tarif.denda)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tarif.efektif_dari)}
                          {tarif.efektif_sampai ? ` - ${formatDate(tarif.efektif_sampai)}` : " - Sekarang"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {tarif.keterangan || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(tarif)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(tarif.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
                          >
                            <FaTrash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Tidak ada data tarif yang sesuai dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarifManagement;