import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaSearch, FaCalendarAlt, FaMoneyBillWave, FaRegCreditCard, FaRegFileAlt, FaSpinner, FaChevronDown } from "react-icons/fa";

const Payments = () => {
  const token = localStorage.getItem("token");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [outstandingRecords, setOutstandingRecords] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("outstanding");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    penggunaan_id: "",
    tanggal_pembayaran: "",
    jumlah_pembayaran: "",
    metode_pembayaran: "",
    keterangan: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [paymentMethods] = useState([
    "Tunai",
    "Transfer Bank",
    "QRIS",
    "E-Wallet",
    "Lainnya"
  ]);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const fetchOutstandingRecords = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/penggunaan/history?bulan=${month}&tahun=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pendingRecords = res.data.filter(record => (record.status ?? "pending") === "pending");
      setOutstandingRecords(pendingRecords);
      if (activeTab === "outstanding") setFilteredRecords(pendingRecords);
    } catch (error) {
      console.error("Error fetching outstanding records:", error);
      showMessage("Gagal memuat data tagihan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pembayaran/history?bulan=${month}&tahun=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentHistory(res.data);
      if (activeTab === "history") setFilteredRecords(res.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      showMessage("Gagal memuat riwayat pembayaran", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchOutstandingRecords();
    fetchPaymentHistory();
  }, [month, year, token]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRecords(activeTab === "outstanding" ? outstandingRecords : paymentHistory);
    } else {
      const recordsToFilter = activeTab === "outstanding" ? outstandingRecords : paymentHistory;
      const filtered = recordsToFilter.filter(record =>
        record.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, outstandingRecords, paymentHistory, activeTab]);

  useEffect(() => {
    setSearchTerm("");
    setSelectedRecord(null);
    setFilteredRecords(activeTab === "outstanding" ? outstandingRecords : paymentHistory);
  }, [activeTab, outstandingRecords, paymentHistory]);

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setPaymentForm({
      penggunaan_id: record.id,
      tanggal_pembayaran: new Date().toISOString().split("T")[0],
      jumlah_pembayaran: record.total_tagihan,
      metode_pembayaran: paymentMethods[0], 
      keterangan: "",
    });
    
    // Scroll to payment form on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('payment-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePaymentInputChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/pembayaran`, paymentForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Pembayaran berhasil dicatat dan tagihan telah dipindahkan ke riwayat", "success");

      fetchOutstandingRecords();
      fetchPaymentHistory();

      setSelectedRecord(null);
      setPaymentForm({
        penggunaan_id: "",
        tanggal_pembayaran: "",
        jumlah_pembayaran: "",
        metode_pembayaran: "",
        keterangan: "",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      showMessage("Terjadi kesalahan saat mencatat pembayaran", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPayment = () => {
    setSelectedRecord(null);
    setPaymentForm({
      penggunaan_id: "",
      tanggal_pembayaran: "",
      jumlah_pembayaran: "",
      metode_pembayaran: "",
      keterangan: "",
    });
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 md:p-6 flex-1">
          {/* Header with actions */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pembayaran</h2>
              
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="w-full md:w-auto">
                  <button
                    onClick={toggleMobileFilter}
                    className="md:hidden w-full flex items-center justify-between bg-gray-500 p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <span>Filter: {monthNames[month-1]} {year}</span>
                    <FaChevronDown className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`${isMobileFilterOpen ? 'flex' : 'hidden'} md:flex gap-2 mt-2 md:mt-0 flex-wrap`}>
                    <select
                      value={month}
                      onChange={handleMonthChange}
                      className="p-2 border border-gray-500 rounded-md bg-black shadow-sm"
                    >
                      {monthNames.map((monthName, index) => (
                        <option key={index} value={index + 1}>
                          {monthName}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={year}
                      onChange={handleYearChange}
                      className="p-2 border border-gray-500 rounded-md bg-black shadow-sm"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(yearOption => (
                        <option key={yearOption} value={yearOption}>
                          {yearOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message display */}
            {message && (
              <div 
                className={`mt-4 p-3 rounded-lg flex items-center shadow-md ${
                  messageType === "success" 
                    ? "bg-green-50 text-green-700 border-l-4 border-green-500" 
                    : "bg-red-50 text-red-700 border-l-4 border-red-500"
                }`}
              >
                <div className={`w-5 h-5 mr-2 rounded-full ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
                {message}
              </div>
            )}
          </div>
          
          {/* Tab navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-1 gap-5 inline-flex">
            <button
              onClick={() => setActiveTab("outstanding")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === "outstanding" 
                  ? "bg-blue-800 text-white shadow-sm" 
                  : "text-white hover:bg-gray-500"
              }`}
            >
              Tagihan Belum Dibayar
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === "history" 
                  ? "bg-blue-800 text-white shadow-sm" 
                  : "text-white hover:bg-gray-500"
              }`}
            >
              Riwayat Pembayaran
            </button>
          </div>
          
          {/* Search box */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all bg-black"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                <FaSearch />
              </div>
            </div>
          </div>
          
          {/* Content for the active tab */}
          <div className="">
            {/* Table content (2/3 of grid on large screens) */}
            <div className={`lg:col-span-${selectedRecord ? '2' : '3'} bg-white rounded-lg shadow-sm overflow-hidden`}>
              {/* Outstanding tab content */}
              {activeTab === "outstanding" ? (
                <div>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tagihan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.nama}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                Rp {Number(record.total_tagihan).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.tanggal}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {record.status ?? "pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleSelectRecord(record)}
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium text-sm transition-colors flex items-center"
                                >
                                  <FaRegCreditCard className="mr-1.5" /> Bayar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="bg-blue-50 rounded-full p-4 mb-4">
                        <FaRegFileAlt className="text-blue-500 text-2xl" />
                      </div>
                      <p className="text-gray-600">Tidak ada tagihan yang belum dibayar.</p>
                    </div>
                  )}
                </div>
              ) : (
                // Payment history tab content
                <div>
                  {historyLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.nama}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                Rp {Number(record.jumlah_pembayaran).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.tanggal_pembayaran}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {record.metode_pembayaran}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="bg-blue-50 rounded-full p-4 mb-4">
                        <FaRegFileAlt className="text-blue-500 text-2xl" />
                      </div>
                      <p className="text-gray-600">Tidak ada riwayat pembayaran.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Payment form (1/3 of grid on large screens) */}
            {selectedRecord && (
              <div className="lg:col-span-1" id="payment-form">
                <div className="bg-gray-400 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4 border-b pb-2 text-white text-center">Form Pembayaran</h3>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-semibold">Nama Pelanggan</span>
                      <span className="text-sm text-black font-semibold">{selectedRecord.nama}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-semibold">Alamat</span>
                      <span className="text-sm text-black font-semibold">{selectedRecord.alamat}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-black font-semibold">Penggunaan</span>
                      <span className="text-sm font-semibold text-black">{selectedRecord.jumlah_penggunaan} m³</span>
                    </div>
                    <div className="flex justify-between text-blue-800 font-medium pt-2 border-t border-blue-200">
                      <span>Total Tagihan</span>
                      <span>Rp {Number(selectedRecord.total_tagihan).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembayaran</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaCalendarAlt />
                        </div>
                        <input
                          type="date"
                          name="tanggal_pembayaran"
                          value={paymentForm.tanggal_pembayaran}
                          onChange={handlePaymentInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pembayaran</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaMoneyBillWave />
                        </div>
                        <input
                          type="number"
                          name="jumlah_pembayaran"
                          value={paymentForm.jumlah_pembayaran}
                          onChange={handlePaymentInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaRegCreditCard />
                        </div>
                        <select
                          name="metode_pembayaran"
                          value={paymentForm.metode_pembayaran}
                          onChange={handlePaymentInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                          required
                        >
                          {paymentMethods.map((method, idx) => (
                            <option key={idx} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <FaChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                      <textarea
                        name="keterangan"
                        value={paymentForm.keterangan}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                        rows="3"
                        placeholder="Tambahkan catatan jika diperlukan..."
                      ></textarea>
                    </div>
                    
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaMoneyBillWave className="mr-2" />}
                        Proses Pembayaran
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelPayment}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
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