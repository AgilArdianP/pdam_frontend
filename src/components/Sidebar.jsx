import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  BarChart, 
  CreditCard, 
  FileText, 
  Menu, 
  X,
  Database
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Menu items dengan ikon yang sesuai
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Pelanggan", path: "/customers", icon: <Users size={20} /> },
    { name: "Penggunaan", path: "/usage", icon: <BarChart size={20} /> },
    { name: "Pembayaran", path: "/payments", icon: <CreditCard size={20} /> },
    { name: "Tagihan", path: "/tagihan", icon: <FileText size={20} /> },
    { name: "Backup", path: "/backup", icon: <Database size={20} /> },
  ];

  // Mendeteksi perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Tutup menu mobile jika layar diperbesar
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mencegah scroll saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen && windowWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen, windowWidth]);

  return (
    <>
      {/* Sidebar */}
      <motion.div 
        initial={{ x: windowWidth >= 1024 ? 0 : '-100%' }}
        animate={{ 
          x: isMobileMenuOpen || windowWidth >= 1024 ? 0 : '-100%',
          width: windowWidth >= 1024 ? 'auto' : '270px'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed lg:relative bg-gradient-to-b from-gray-900 to-blue-800 text-white 
          flex flex-col h-full lg:min-h-screen shadow-xl z-20
          w-64 md:w-72 max-w-xs md:max-w-sm
        `}
      >
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
              <span className="font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider">PDAM Desa</h1>
          </div>
          <div className="text-xs text-blue-300 mt-1 ml-11">Pengelolaan Air Bersih</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-2 md:px-3 space-y-1 md:space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    onClick={() => windowWidth < 1024 && setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-700 text-white font-medium shadow-md' 
                        : 'text-white hover:bg-blue-700/50 hover:text-white'}
                    `}
                  >
                    <span className={`mr-3 ${isActive ? 'text-blue-300' : 'text-blue-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-5 bg-blue-400 rounded-full"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 text-xs text-blue-300 text-center">
          PDAM Desa © {new Date().getFullYear()}
        </div>
      </motion.div>

      {/* Mobile menu button - adaptif berdasarkan status menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button 
          onClick={toggleMobileMenu} 
          className={`
            flex items-center justify-center w-10 h-10 rounded-full shadow-lg focus:outline-none
            ${isMobileMenuOpen ? 'bg-blue-500' : 'bg-blue-500'}
            transition-colors duration-300
          `}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileMenuOpen ? "close" : "menu"}
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isMobileMenuOpen 
                ? <X size={24} className="text-white" /> 
                : <Menu size={24} className="text-white" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Overlay untuk mobile - dianimasikan */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-10 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;