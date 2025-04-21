// src/pages/Tagihan.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaFilePdf, FaFileExcel, FaReceipt, FaSearch, FaCalendarAlt } from "react-icons/fa";

const Tagihan = () => {
  const token = localStorage.getItem("token");
  const currentDate = new Date();
  const defaultMonth = currentDate.getMonth() + 1;
  const defaultYear = currentDate.getFullYear();
  const [filterMonth, setFilterMonth] = useState(defaultMonth.toString());
  const [filterYear, setFilterYear] = useState(defaultYear.toString());
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Format number to currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[parseInt(monthNumber) - 1];
  };

  // Fungsi mengambil data penggunaan history dari backend
  const fetchUsages = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/penggunaan/history?bulan=${filterMonth}&tahun=${filterYear}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsages(res.data);
    } catch (err) {
      console.error("Error fetching usage history:", err);
      toast.error("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsages();
  }, [filterMonth, filterYear]);

  // Filter data based on search term
  const filteredUsages = usages.filter(usage => 
    usage.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usage.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usage.id?.toString().includes(searchTerm) ||
    usage.pelanggan_id?.toString().includes(searchTerm)
  );

  // Fungsi ekspor laporan PDF
  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/tagihan/export/pdf?bulan=${filterMonth}&tahun=${filterYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_${getMonthName(filterMonth)}_${filterYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast.error("Gagal mengunduh PDF. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // Fungsi ekspor laporan Excel
  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/tagihan/export/excel?bulan=${filterMonth}&tahun=${filterYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_${getMonthName(filterMonth)}_${filterYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    } catch (err) {
      console.error("Error exporting Excel:", err);
      toast.error("Gagal mengunduh Excel. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // Fungsi cetak nota untuk penggunaan tertentu
  // Contoh fungsi handleCetakNota di Tagihan.jsx
const handleCetakNota = async (usageId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/tagihan/nota/${usageId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob", // penting untuk menerima file PDF sebagai blob
    });
    // Membuat URL blob dan membuka di tab baru
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    window.open(url, "_blank");
  } catch (err) {
    console.error("Error printing nota:", err);
    alert("Gagal membuat nota. Cek console untuk detail error.");
  }
};


  // Show usage details in modal
  const showUsageDetails = (usage) => {
    setSelectedUsage(usage);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1 overflow-hidden">
          {/* Header section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tagihan & Riwayat Penggunaan</h2>
            <p className="text-gray-600">Kelola dan lihat riwayat penggunaan air pelanggan</p>
          </div>

          {/* Filter & Search Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                <div className="relative">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {getMonthName(month)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input
                  type="number"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="2020"
                  max="2030"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cari</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama/ID/alamat..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={fetchUsages} 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center"
                >
                  {loading ? "Memuat..." : "Terapkan Filter"}
                </button>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex flex-wrap gap-2 border-t pt-4 mt-4">
              <button 
                onClick={handleExportPDF} 
                disabled={loading || usages.length === 0}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center text-sm"
              >
                <FaFilePdf className="mr-2" /> Ekspor PDF
              </button>
              <button 
                onClick={handleExportExcel} 
                disabled={loading || usages.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center text-sm"
              >
                <FaFileExcel className="mr-2" /> Ekspor Excel
              </button>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredUsages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Tidak ada data yang tersedia untuk periode ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Informasi</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penggunaan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsages.map((usage) => (
                      <tr key={usage.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">#{usage.id}</div>
                          <div className="text-xs">ID Pelanggan: {usage.pelanggan_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{usage.nama}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{usage.alamat}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{usage.jumlah_penggunaan} m³</div>
                          <div className="text-sm font-medium text-blue-600">{formatCurrency(usage.total_tagihan)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(usage.tanggal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex space-x-2 justify-center">
                            <button
                              onClick={() => showUsageDetails(usage)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleCetakNota(usage.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaReceipt className="mr-1" /> Cetak Nota
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedUsage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detail Penggunaan</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID Penggunaan</p>
                    <p className="font-medium">{selectedUsage.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Pelanggan</p>
                    <p className="font-medium">{selectedUsage.pelanggan_id}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Nama Pelanggan</p>
                  <p className="font-medium">{selectedUsage.nama}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-medium">{selectedUsage.alamat}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Jumlah Penggunaan</p>
                    <p className="font-medium">{selectedUsage.jumlah_penggunaan} m³</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Tagihan</p>
                    <p className="font-medium text-blue-600">{formatCurrency(selectedUsage.total_tagihan)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium">{formatDate(selectedUsage.tanggal)}</p>
                </div>
                
                {selectedUsage.foto_url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Foto Meter</p>
                    <img 
                      src={selectedUsage.foto_url} 
                      alt="Foto Meter" 
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleCetakNota(selectedUsage.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaReceipt className="mr-2" /> Cetak Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tagihan;