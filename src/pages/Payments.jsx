// src/pages/Payments.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Payments = () => {
  const [formData, setFormData] = useState({
    penggunaan_id: "",
    tanggal_pembayaran: "",
    jumlah_pembayaran: "",
    metode_pembayaran: "",
    keterangan: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [viewMode, setViewMode] = useState("form"); // "form" atau "history"
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/pembayaran", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentHistory(res.data);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setMessage({ text: "Gagal memuat data pembayaran", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "history") {
      fetchPayments();
    }
  }, [viewMode, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/pembayaran", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage({ text: "Pembayaran berhasil dicatat", type: "success" });
      setFormData({
        penggunaan_id: "",
        tanggal_pembayaran: "",
        jumlah_pembayaran: "",
        metode_pembayaran: "",
        keterangan: "",
      });
      // Refresh payment history if in background
      if (viewMode === "history") {
        fetchPayments();
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Terjadi kesalahan dalam mencatat pembayaran", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = paymentHistory.filter(
    (payment) =>
      payment.id.toString().includes(searchTerm) ||
      payment.penggunaan_id.toString().includes(searchTerm) ||
      payment.metode_pembayaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pembayaran</h2>
              <div className="flex mt-3 sm:mt-0">
                <button
                  onClick={() => setViewMode("form")}
                  className={`px-4 py-2 mr-2 rounded-md transition-all duration-200 ${
                    viewMode === "form"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Catat Pembayaran
                </button>
                <button
                  onClick={() => setViewMode("history")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    viewMode === "history"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Riwayat Pembayaran
                </button>
              </div>
            </div>

            {message.text && (
              <div 
                className={`mb-4 p-3 rounded-md flex items-center ${
                  message.type === "success" 
                    ? "bg-green-100 text-green-700 border-l-4 border-green-500" 
                    : "bg-red-100 text-red-700 border-l-4 border-red-500"
                }`}
              >
                <span className="material-icons mr-2">
                  {message.type === "success" ? "check_circle" : "error"}
                </span>
                {message.text}
                <button 
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            )}

            {viewMode === "form" ? (
              <div className="bg-white rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Penggunaan
                      </label>
                      <input
                        type="number"
                        name="penggunaan_id"
                        value={formData.penggunaan_id}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                        placeholder="Masukkan ID penggunaan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Pembayaran
                      </label>
                      <input
                        type="date"
                        name="tanggal_pembayaran"
                        value={formData.tanggal_pembayaran}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah Pembayaran (Rp)
                      </label>
                      <input
                        type="number"
                        name="jumlah_pembayaran"
                        value={formData.jumlah_pembayaran}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metode Pembayaran
                      </label>
                      <select
                        name="metode_pembayaran"
                        value={formData.metode_pembayaran}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      >
                        <option value="">Pilih metode pembayaran</option>
                        <option value="Cash">Cash</option>
                        <option value="Transfer Bank">Transfer Bank</option>
                        <option value="QRIS">QRIS</option>
                        <option value="E-Wallet">E-Wallet</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      rows="3"
                      placeholder="Tambahkan keterangan atau catatan (opsional)"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </>
                      ) : (
                        "Simpan Pembayaran"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari pembayaran..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data pembayaran</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? "Tidak ada hasil yang sesuai dengan pencarian Anda" : "Belum ada pembayaran yang dicatat dalam sistem"}
                    </p>
                    {searchTerm && (
                      <button
                        type="button"
                        className="mt-3 text-sm text-blue-600 hover:text-blue-500"
                        onClick={() => setSearchTerm("")}
                      >
                        Hapus pencarian
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-md shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Penggunaan</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPayments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.penggunaan_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.tanggal_pembayaran)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(payment.jumlah_pembayaran)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${payment.metode_pembayaran === 'Cash' ? 'bg-green-100 text-green-800' : ''}
                                ${payment.metode_pembayaran === 'Transfer Bank' ? 'bg-blue-100 text-blue-800' : ''}
                                ${payment.metode_pembayaran === 'QRIS' ? 'bg-purple-100 text-purple-800' : ''}
                                ${payment.metode_pembayaran === 'E-Wallet' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${!['Cash', 'Transfer Bank', 'QRIS', 'E-Wallet'].includes(payment.metode_pembayaran) ? 'bg-gray-100 text-gray-800' : ''}
                              `}>
                                {payment.metode_pembayaran}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{payment.keterangan || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                  <div>
                    Total: {filteredPayments.length} pembayaran
                  </div>
                  <button 
                    onClick={fetchPayments}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;