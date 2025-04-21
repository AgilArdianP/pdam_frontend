import { useNavigate } from "react-router-dom";
import { LogOut, Bell, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Layanan notifikasi terpisah untuk mengelola notifikasi
const useNotificationService = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Tagihan baru telah dibuat", time: "5 menit yang lalu", unread: true },
    { id: 2, message: "2 pelanggan baru terdaftar", time: "1 jam yang lalu", unread: true },
    { id: 3, message: "Pembayaran berhasil dikonfirmasi", time: "3 jam yang lalu", unread: false },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Menghitung jumlah notifikasi yang belum dibaca saat komponen mount atau notifikasi berubah
  useEffect(() => {
    const count = notifications.filter(notification => notification.unread).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fungsi untuk menambahkan notifikasi baru
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      time: "Baru saja",
      unread: true,
      type // info, success, warning, error
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Opsional: Tampilkan toast/alert untuk notifikasi baru
    showToast(message, type);
    
    return newNotification.id;
  };

  // Fungsi untuk menampilkan toast notifikasi (implementasi sederhana)
  const showToast = (message, type) => {
    // Bisa diimplementasikan dengan library seperti react-toastify
    // Atau solusi custom sederhana
    console.log(`[${type.toUpperCase()}] New notification: ${message}`);
  };

  // Menandai notifikasi sudah dibaca
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false } 
          : notification
      )
    );
  };

  // Menandai semua notifikasi sudah dibaca
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  // Hapus notifikasi
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear semua notifikasi
  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
};

// Komponen Navbar dengan sistem notifikasi yang ditingkatkan
const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    
    // Gunakan service notifikasi
    const {
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    } = useNotificationService();

    // Simulasi notifikasi masuk baru (untuk contoh)
    useEffect(() => {
      // WebSocket atau poling interval seharusnya dibuat di sini
      const simulateIncomingNotifications = () => {
        const messages = [
          "Pelanggan baru terdaftar di sistem",
          "Tagihan baru telah dibuat untuk RT 03",
          "Pembayaran berhasil dikonfirmasi dari pelanggan ID #1234",
          "Ada permintaan bantuan teknis di wilayah Desa Cinta",
          "Laporan bulanan siap untuk diunduh"
        ];
        
        const types = ["info", "success", "warning"];
        
        // Tambahkan notifikasi acak setiap interval waktu
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        addNotification(messages[randomIndex], randomType);
      };
      
      // Simulasikan notifikasi baru setiap 30 detik
      // Dalam produksi, ini akan diganti dengan koneksi WebSocket atau long polling
      const interval = setInterval(simulateIncomingNotifications, 30000);
      
      return () => clearInterval(interval);
    }, [addNotification]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Ketika notifikasi diklik
    const handleNotificationClick = (notificationId) => {
        markAsRead(notificationId);
        // Di sini bisa ditambahkan navigasi ke halaman terkait
        // navigate(`/activity/${notificationId}`);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fungsi untuk memformat waktu yang relatif
    const getRelativeTime = (timeString) => {
        // Implementasi sederhana - dalam produksi sebaiknya gunakan library seperti date-fns
        return timeString;
    };

    // Fungsi untuk mendapatkan warna berdasarkan tipe notifikasi
    const getNotificationColor = (type) => {
        switch(type) {
            case 'success': return 'border-green-500';
            case 'warning': return 'border-yellow-500';
            case 'error': return 'border-red-500';
            default: return 'border-blue-500';
        }
    };

    return (
        <div className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
            {/* Left side - empty for desktop, shown on mobile */}
            <div className="lg:hidden text-xl font-bold text-blue-900">
                PDAM Desa
            </div>

            {/* Right side - user controls */}
            <div className="flex-1 flex justify-end items-center space-x-4">
                {/* Search - hidden on mobile */}
                <div className="hidden md:flex relative">
                    <input 
                        type="text" 
                        placeholder="Cari..." 
                        className="px-4 py-2 pl-10 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-64"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>

                {/* Notification bell */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-100 relative"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full transform translate-x-1/4 -translate-y-1/4">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications dropdown */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
                            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-gray-700">Notifikasi</h3>
                                <div className="flex space-x-2">
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div 
                                            key={notification.id} 
                                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                                                notification.unread 
                                                    ? getNotificationColor(notification.type) 
                                                    : 'border-transparent'
                                            } flex justify-between`}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className="flex-1">
                                                <p className={`text-sm ${notification.unread ? 'font-medium text-gray-800' : 'text-gray-700'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {getRelativeTime(notification.time)}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 8l-8 8-8-8"></path>
                                        </svg>
                                        <p className="text-sm">Tidak ada notifikasi</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-200 flex justify-between">
                                <button 
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                    onClick={() => navigate('/notifications')}
                                >
                                    Lihat semua notifikasi
                                </button>
                                {notifications.length > 0 && (
                                    <button 
                                        className="text-xs text-red-500 hover:text-red-700"
                                        onClick={clearAll}
                                    >
                                        Hapus semua
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User profile */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-100"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white">
                            <User size={16} />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-700">Admin</p>
                            <p className="text-xs text-gray-500">admin@pdamdesa.com</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {/* User dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Profil Saya
                            </a>
                            <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Pengaturan
                            </a>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                            >
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;