import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Menu,
  Info
} from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_pelayanan: "Reguler",
    keterangan: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);

  // Ambil data pelanggan (dengan atau tanpa filter pencarian)
  const fetchCustomers = async (query = "") => {
    setIsLoading(true);
    try {
      const url = query
        ? `${import.meta.env.VITE_API_URL}/api/pelanggan/search?query=${query}`
        : `${import.meta.env.VITE_API_URL}/api/pelanggan`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Urutkan pelanggan berdasarkan nama (A-Z)
      const sortedCustomers = res.data.sort((a, b) => 
        a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' })
      );
      
      setCustomers(sortedCustomers);
      setCurrentPage(1); // Reset ke halaman pertama setelah fetch data baru
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        // Update pelanggan
        await axios.put(`${import.meta.env.VITE_API_URL}/api/pelanggan/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Tambah pelanggan baru
        await axios.post(`${import.meta.env.VITE_API_URL}/api/pelanggan`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ nama: "", alamat: "", jenis_pelayanan: "Reguler", keterangan: "" });
      setEditingId(null);
      setShowForm(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}"?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/pelanggan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      nama: customer.nama,
      alamat: customer.alamat,
      jenis_pelayanan: customer.jenis_pelayanan,
      keterangan: customer.keterangan,
    });
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById("customer-form").scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(searchQuery);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nama: "", alamat: "", jenis_pelayanan: "Reguler", keterangan: "" });
    setShowForm(false);
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile, shown when sidebarOpen is true */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col w-full">
        {/* Navbar with hamburger menu */}
        <div className="bg-white shadow-sm z-10">
          <div className="flex items-center px-4 h-16">
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-gray-600 lg:hidden focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <Navbar />
          </div>
        </div>

        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pelanggan</h2>
              <p className="text-gray-500 text-sm mt-1">Kelola data pelanggan PDAM Desa</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showForm 
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {showForm ? (
                  <>
                    <X size={16} className="mr-1" />
                    <span className="hidden xs:inline">Tutup Form</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-1" />
                    <span className="hidden xs:inline">Tambah</span><span className="inline xs:hidden">+</span>
                  </>
                )}
              </button>
              <button
                onClick={() => fetchCustomers()}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw size={16} className="mr-1" />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm mb-4 md:mb-6">
            <form onSubmit={handleSearch} className="flex flex-col xs:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari nama/alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Search size={16} className="mr-1" />
                  <span>Cari</span>
                </button>
                <button
                  type="button"
                  className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm"
                >
                  <Filter size={16} className="hidden xs:block xs:mr-1" />
                  <span>Filter</span>
                </button>
              </div>
            </form>
          </div>

          {showForm && (
            <div id="customer-form" className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-4 md:mb-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                {editingId ? (
                  <>
                    <Edit2 size={18} className="mr-2 text-blue-600" />
                    Edit Pelanggan
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2 text-blue-600" />
                    Tambah Pelanggan Baru
                  </>
                )}
              </h3>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama pelanggan"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan alamat lengkap"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Jenis Pelayanan</label>
                  <select
                    name="jenis_pelayanan"
                    value={formData.jenis_pelayanan}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Subsidi">Subsidi</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                  <input
                    type="text"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Keterangan tambahan (opsional)"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Check size={16} className="mr-1" />
                    {editingId ? "Update" : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-3">
              <div className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat data...
              </div>
            </div>
          )}

          {/* Card view untuk mobile, table untuk desktop */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pelayanan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-center text-gray-500 text-sm" colSpan="5">
                        {isLoading ? "Memuat data..." : "Tidak ada data pelanggan"}
                      </td>
                    </tr>
                  ) : (
                    currentCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{customer.nama}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{customer.alamat}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            customer.jenis_pelayanan === "Reguler" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {customer.jenis_pelayanan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{customer.keterangan || "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(customer)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id, customer.nama)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {customers.length === 0 ? (
                <div className="px-4 py-4 text-center text-gray-500 text-sm">
                  {isLoading ? "Memuat data..." : "Tidak ada data pelanggan"}
                </div>
              ) : (
                currentCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{customer.nama}</div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id, customer.nama)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-medium text-gray-600">Alamat:</span> {customer.alamat}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        customer.jenis_pelayanan === "Reguler" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {customer.jenis_pelayanan}
                      </span>
                      {customer.keterangan && (
                        <div className="text-xs text-gray-600 flex items-center">
                          <Info size={12} className="mr-1" />
                          {customer.keterangan}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {customers.length > 0 && (
              <div className="px-4 py-3 flex flex-col xs:flex-row xs:items-center justify-between border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500 mb-2 xs:mb-0">
                  {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, customers.length)} dari {customers.length} pelanggan
                </div>
                <div className="flex items-center justify-center xs:justify-end space-x-1">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className={`px-2 py-1 border flex items-center ${
                      currentPage === 1 
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } rounded text-xs`}
                  >
                    <ChevronLeft size={14} className="mr-1" />
                    <span className="hidden xs:inline">Sebelumnya</span>
                  </button>
                  
                  {/* Page numbers - show fewer on mobile */}
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages).keys()]
                      .filter(num => {
                        // On mobile, show fewer page numbers
                        if (window.innerWidth < 640) {
                          return num + 1 === 1 || num + 1 === totalPages || 
                                 (num + 1 >= currentPage - 1 && num + 1 <= currentPage + 1);
                        }
                        return true;
                      })
                      .map(number => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`px-2 py-1 border rounded text-xs ${
                            currentPage === number + 1
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                  </div>
                  
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 border flex items-center ${
                      currentPage === totalPages 
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } rounded text-xs`}
                  >
                    <span className="hidden xs:inline">Selanjutnya</span>
                    <ChevronRight size={14} className="ml-1" />
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

export default Customers;