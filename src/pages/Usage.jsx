import { useState, useEffect } from "react";
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
  Info 
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

  // Fetch customers for dropdown selection
  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pelanggan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPelangganList(res.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchPelanggan();
  }, [token]);

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
    } else if (name === "pelanggan_id") {
      setFormData({
        ...formData,
        [name]: value,
      });
      
      // Find and set selected customer details
      const customer = pelangganList.find(p => p.id === parseInt(value));
      setSelectedCustomer(customer);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
    <div className="flex h-screen w-screen bg-gray-50">
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
                {/* Customer Selection */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User size={16} className="mr-2 text-gray-500" />
                    Pelanggan
                  </label>
                  <select
                    name="pelanggan_id"
                    value={formData.pelanggan_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {pelangganList.map(pelanggan => (
                      <option key={pelanggan.id} value={pelanggan.id}>
                        {pelanggan.nama} ({pelanggan.jenis_pelayanan})
                      </option>
                    ))}
                  </select>
                  
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
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