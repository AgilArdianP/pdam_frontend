// src/pages/Tagihan.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaFilePdf, FaFileExcel, FaReceipt, FaSearch, FaCalendarAlt, FaFilter, FaSpinner, FaEye, FaInfoCircle } from "react-icons/fa";

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
  const [activeTab, setActiveTab] = useState("outstanding"); // "outstanding" (belum bayar) atau "paid" (sudah bayar)
  const [isExporting, setIsExporting] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  // Tambahkan state untuk modal detail
  const [showModal, setShowModal] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState(null);

  // Format number to currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return months[parseInt(monthNumber) - 1];
  };

  // Fetch data penggunaan dari backend
  const fetchUsages = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/penggunaan/history?bulan=${filterMonth}&tahun=${filterYear}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response data penggunaan:", res.data);
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

  // Filter data berdasarkan tab yang dipilih
  const filteredUsages = usages.filter((usage) =>
    activeTab === "outstanding"
      ? (usage.status ?? "pending") === "pending" // Jika `status` tidak ada, anggap pending
      : usage.status === "paid"
  );

  // Filter berdasarkan pencarian nama pelanggan
  const searchFilteredUsages = filteredUsages.filter((usage) =>
    usage.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export laporan PDF
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tagihan/export/pdf?bulan=${filterMonth}&tahun=${filterYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_${getMonthName(filterMonth)}_${filterYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success("Berhasil mengunduh laporan PDF");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast.error("Gagal mengunduh PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // Export laporan Excel
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tagihan/export/excel?bulan=${filterMonth}&tahun=${filterYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_${getMonthName(filterMonth)}_${filterYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      toast.success("Berhasil mengunduh laporan Excel");
    } catch (err) {
      console.error("Error exporting Excel:", err);
      toast.error("Gagal mengunduh Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  // Cetak nota tagihan per pelanggan
  const handleCetakNota = async (usageId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tagihan/nota/${usageId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank");
      toast.success("Berhasil membuka nota tagihan");
    } catch (err) {
      console.error("Error printing nota:", err);
      toast.error("Gagal mencetak nota.");
    } finally {
      setLoading(false);
    }
  };

  // Simple toast system (you can replace with a proper toast library like react-toastify)
  const toast = {
    success: (message) => alert(message),
    error: (message) => alert(message),
  };

  // Handle filter apply
  const applyFilter = () => {
    fetchUsages();
    setShowFilterPanel(false);
  };

  // Fungsi untuk menampilkan detail tagihan
  const showDetails = (usage) => {
    setSelectedUsage(usage);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manajemen Tagihan
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <div className="relative">
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <FaFilter className="mr-2" />
                  <span>Filter</span>
                </button>
                
                {showFilterPanel && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-3">Filter Tagihan</h3>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {getMonthName(month)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                      >
                        {Array.from({ length: 5 }, (_, i) => defaultYear - 2 + i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={applyFilter}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Terapkan Filter
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {isExporting ? <FaSpinner className="animate-spin mr-2" /> : <FaFilePdf className="mr-2" />}
                <span>Export PDF</span>
              </button>
              
              <button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {isExporting ? <FaSpinner className="animate-spin mr-2" /> : <FaFileExcel className="mr-2" />}
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Info Display */}
          <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>
              Menampilkan data untuk periode: <b>{getMonthName(filterMonth)} {filterYear}</b>
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("outstanding")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === "outstanding"
                      ? "border-blue-600 text-white bg-blue-800"
                      : "border-transparent text-white hover:border-gray-300 hover:bg-gray-500"
                  }`}
                >
                  Belum Dibayar
                </button>
                <button
                  onClick={() => setActiveTab("paid")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === "paid"
                      ? "border-blue-600 text-white bg-blue-800"
                      : "border-transparent text-white hover:border-gray-300 hover:bg-gray-500"
                  }`}
                >
                  Sudah Dibayar
                </button>
              </nav>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Data Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              </div>
            ) : searchFilteredUsages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tagihan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchFilteredUsages.map((usage) => (
                      <tr key={usage.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usage.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{usage.nama}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{usage.alamat}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(usage.total_tagihan)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (usage.status ?? "pending") === "pending" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {(usage.status === "paid") ? "Sudah Dibayar" : "Belum Dibayar"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                          <button 
                            onClick={() => showDetails(usage)} 
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FaInfoCircle className="mr-2" />
                            Detail
                          </button>
                          <button 
                            onClick={() => handleCetakNota(usage.id)} 
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaEye className="mr-2" />
                            Lihat Nota
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-12 text-gray-500">
                <p className="text-lg">Tidak ada data tagihan yang ditemukan.</p>
                <p className="mt-2">Coba ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>

          {/* Summary Section - Only show if data exists */}
          {searchFilteredUsages.length > 0 && (
            <div className="mt-6 bg-gray-400 p-4 md:p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-black text-center mb-4">Ringkasan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-500 p-4 rounded-lg hover:bg-gray-800">
                  <p className="text-sm text-white text-center font-semibold">Total Tagihan</p>
                  <p className="text-xl font-bold text-center">{searchFilteredUsages.length}</p>
                </div>
                <div className={`${activeTab === "outstanding" ? "bg-gray-500" : "bg-gray-500"} p-4 rounded-lg hover:bg-gray-800`}>
                  <p className={`text-sm ${activeTab === "outstanding" ? "text-white" : "text-white"} text-center`}>
                    {activeTab === "outstanding" ? "Total Belum Dibayar" : "Total Sudah Dibayar"}
                  </p>
                  <p className="text-xl font-bold text-center">
                    {formatCurrency(searchFilteredUsages.reduce((sum, item) => sum + item.total_tagihan, 0))}
                  </p>
                </div>
                <div className="bg-gray-500 p-4 rounded-lg hover:bg-gray-800">
                  <p className="text-sm text-white text-center font-semibold">Periode</p>
                  <p className="text-xl font-bold text-center">{getMonthName(filterMonth)} {filterYear}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showModal && selectedUsage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black">Detail Penggunaan</h3>
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
                      <p className="text-sm text-center text-black font-semibold mb-2">ID Penggunaan :</p>
                      <p className="text-gray-700 text-center">{selectedUsage.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-black text-center font-semibold mb-2">ID Pelanggan :</p>
                      <p className="text-gray-700 text-center">{selectedUsage.pelanggan_id}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-black  font-semibold mb-2">Nama Pelanggan :</p>
                    <p className="text-gray-700 font-medium">{selectedUsage.nama}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-black font-semibold mb-2">Alamat :</p>
                    <p className="font-medium text-gray-700">{selectedUsage.alamat}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-black text-center font-bold mb-2">Jumlah Penggunaan :</p>
                      <p className="font-medium text-gray-700 text-center">{selectedUsage.jumlah_penggunaan} m³</p>
                    </div>
                    <div>
                      <p className="text-sm text-black text-center font-bold">Total Tagihan :</p>
                      <p className="font-medium text-center text-blue-600">{formatCurrency(selectedUsage.total_tagihan)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-black font-bold">Tanggal :</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedUsage.tanggal)}</p>
                  </div>
                  
                  {selectedUsage.foto_url && (
                    <div>
                      <p className="text-sm text-black font-bold mb-2">Foto Metereran</p>
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
    </div>
  );
};

export default Tagihan;