import React, { useState } from "react";

const Contact = () => {
  // Fixed state initialization - corrected property name
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fixed handleChange function - corrected e.target.valye to e.target.value
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validate form fields
    if (!form.name || !form.email || !form.message) {
      setError("Mohon lengkapi semua field");
      setLoading(false);
      return;
    }
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log("Pesan terkirim:", form);
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2">Hubungi Kami</h1>
            <p className="text-gray-500 text-sm">PDAM Desa - Sistem Pengelolaan Air</p>
          </div>
          
          {/* Contact Form or Success Message */}
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pesan Terkirim</h2>
              <p className="text-gray-600 mb-8">Terima kasih telah menghubungi kami. Kami akan merespons pesan Anda segera.</p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <div className="md:flex">
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Kirim Pesan</h2>
                <p className="text-gray-600 mb-6">
                  Kami senang mendengar dari Anda. Silakan isi formulir di samping untuk mengirim pesan kepada tim kami.
                </p>
                
                <div className="mb-8">
                  <h3 className="font-medium text-gray-800 mb-2">Kontak Langsung</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">Email</p>
                        <p className="text-gray-600">info@pdamdesa.id</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">Telepon</p>
                        <p className="text-gray-600">+62 8123 4567 890</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">Alamat</p>
                        <p className="text-gray-600">Jl. Air Bersih No. 123<br />Desa Sukamaju, Kec. Sejahtera<br />Kabupaten Makmur, 98765</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Jam Operasional</h3>
                  <p className="text-gray-600">
                    Senin - Jumat: 08.00 - 16.00<br />
                    Sabtu: 08.00 - 12.00<br />
                    Minggu & Hari Libur: Tutup
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Nama</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Masukkan email Anda"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Pesan</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Tulis pesan Anda di sini..."
                    ></textarea>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      "Kirim Pesan"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;