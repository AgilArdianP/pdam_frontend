import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  Droplet, 
  Calendar, 
  Camera, 
  User, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Info,
  Search,
  ChevronDown
} from "lucide-react";

const Usage = () => {
  const [formData, setFormData] = useState({
    pelanggan_id: "",
    jumlah_penggunaan: "",
    tanggal: new Date().toISOString().substr(0, 10), // Default to today
    foto: null,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // success or error
  const [isLoading, setIsLoading] = useState(false);
  const [pelangganList, setPelangganList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const token = localStorage.getItem("token");
  
  // Searchable dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const dropdownRef = useRef(null);

  // Fetch customers for dropdown selection
  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pelanggan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPelangganList(res.data);
        setFilteredCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchPelanggan();
  }, [token]);

  // Effect for handling clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(pelangganList);
    } else {
      const filtered = pelangganList.filter(
        (customer) =>
          customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.alamat && customer.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, pelangganList]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "foto") {
      const file = files[0];
      setFormData({
        ...formData,
        foto: file,
      });
      
      // Create preview URL for the image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      pelanggan_id: customer.id.toString(),
    });
    setSelectedCustomer(customer);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = new FormData();
    data.append("pelanggan_id", formData.pelanggan_id);
    data.append("jumlah_penggunaan", formData.jumlah_penggunaan);
    data.append("tanggal", formData.tanggal);
    if (formData.foto) data.append("foto", formData.foto);
    
    try {
      const res = await axios.post("http://localhost:5000/api/penggunaan", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMessage(
        `Data penggunaan berhasil ditambahkan. Total tagihan: ${formatCurrency(res.data.total_tagihan)}`
      );
      setMessageType("success");
      
      // Reset form
      setFormData({ 
        pelanggan_id: "", 
        jumlah_penggunaan: "", 
        tanggal: new Date().toISOString().substr(0, 10),
        foto: null 
      });
      setPreviewUrl(null);
      setSelectedCustomer(null);
      
      // Auto-dismiss message after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Terjadi kesalahan saat menambahkan data penggunaan.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissMessage = () => {
    setMessage("");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex h-min-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Droplet size={24} className="mr-2 text-blue-600" />
              Input Penggunaan Air
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Masukkan data penggunaan air pelanggan untuk perhitungan tagihan
            </p>
          </div>

          {/* Alert/Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start justify-between ${
              messageType === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              <div className="flex">
                {messageType === "success" ? (
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                )}
                <p>{message}</p>
              </div>
              <button 
                onClick={dismissMessage}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-800">Form Input Penggunaan</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Searchable Customer Selection */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User size={16} className="mr-2 text-gray-500" />
                    Pelanggan
                  </label>
                  <div className="relative bg-black rounded-lg" ref={dropdownRef}>
                    <div 
                      className={`flex items-center justify-between w-full border ${isDropdownOpen ? 'bg-black border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'} rounded-lg p-2 cursor-pointer`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="flex-1 flex items-center w-full">
                        {selectedCustomer ? (
                          <span>{selectedCustomer.nama} ({selectedCustomer.jenis_pelayanan})</span>
                        ) : (
                          <span className="text-white">-- Pilih Pelanggan --</span>
                        )}
                      </div>
                      <ChevronDown size={18} className="text-gray-500" />
                    </div>
                    
                    {/* Hidden input for form submission */}
                    <input
                      type="hidden"
                      name="pelanggan_id"
                      value={formData.pelanggan_id}
                      required
                    />
                    
                    {isDropdownOpen && (
                      <div className="absolute mt-1 w-full bg-black border border-gray-300 rounded-lg shadow-lg z-10">
                        <div className="p-2 border-b border-gray-200 sticky top-0 bg-black">
                          <div className="flex items-center bg-black rounded-md px-3 py-2">
                            <Search size={16} className="text-white" />
                            <input
                              type="text"
                              placeholder="Cari pelanggan..."
                              className="ml-2 bg-transparent w-full border-none focus:outline-none focus:ring-0"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto py-1">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                              <div
                                key={customer.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-400 flex justify-between items-center ${
                                  selectedCustomer?.id === customer.id ? 'bg-blue-5300 text-blue-700' : ''
                                }`}
                                onClick={() => handleCustomerSelect(customer)}
                              >
                                <div>
                                  <div className="font-medium">{customer.nama}</div>
                                  <div className="text-sm text-gray-500">{customer.alamat}</div>
                                </div>
                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  customer.jenis_pelayanan === "Reguler" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {customer.jenis_pelayanan}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              Tidak ada pelanggan yang ditemukan
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Selected customer info */}
                  {selectedCustomer && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="text-gray-700">
                        <span className="font-medium">Alamat:</span> {selectedCustomer.alamat}
                      </div>
                      <div className="text-gray-700 mt-1">
                        <span className="font-medium">Layanan:</span> 
                        <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedCustomer.jenis_pelayanan === "Reguler" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {selectedCustomer.jenis_pelayanan}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Usage Amount */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Droplet size={16} className="mr-2 text-gray-500" />
                    Jumlah Penggunaan (m³)
                  </label>
                  <input
                    type="number"
                    name="jumlah_penggunaan"
                    value={formData.jumlah_penggunaan}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan jumlah penggunaan air dalam meter kubik"
                    required
                  />
                </div>
                
                {/* Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    Tanggal Pencatatan
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Camera size={16} className="mr-2 text-gray-500" />
                    Foto Meteran
                  </label>
                  <div className="flex items-center">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-300 hover:bg-gray-400 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Klik untuk upload</span> atau drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, atau JPEG (max. 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        name="foto" 
                        onChange={handleChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </label>
                    
                    {/* Preview Image */}
                    {previewUrl && (
                      <div className="ml-4 relative">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-lg border border-gray-300" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({...formData, foto: null});
                            setPreviewUrl(null);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700 flex">
                <Info size={20} className="mr-3 flex-shrink-0 text-blue-500" />
                <div>
                  <p>Penghitungan tagihan akan dilakukan secara otomatis berdasarkan jumlah penggunaan dan jenis layanan pelanggan.</p>
                  <p className="mt-1">Pastikan data yang dimasukkan sudah sesuai dan benar.</p>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ 
                      pelanggan_id: "", 
                      jumlah_penggunaan: "", 
                      tanggal: new Date().toISOString().substr(0, 10),
                      foto: null 
                    });
                    setPreviewUrl(null);
                    setSelectedCustomer(null);
                  }}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mr-3"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Data"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usage;