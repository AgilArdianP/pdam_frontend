import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  BarChart, 
  CreditCard, 
  FileText, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Pelanggan", path: "/customers", icon: <Users size={20} /> },
    { name: "Penggunaan", path: "/usage", icon: <BarChart size={20} /> },
    { name: "Pembayaran", path: "/payments", icon: <CreditCard size={20} /> },
    { name: "Tagihan", path: "/tagihan", icon: <FileText size={20} /> },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleMobileMenu} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative bg-gradient-to-b from-blue-900 to-blue-800 text-white 
          flex flex-col min-h-screen shadow-xl transition-all duration-300 ease-in-out z-20
          ${isMobileMenuOpen ? 'left-0' : '-left-64'} lg:left-0
          w-64
        `}
      >
        {/* Logo and brand */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
              <span className="font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider">PDAM Desa</h1>
          </div>
          <div className="text-xs text-blue-300 mt-1 ml-11">Pengelolaan Air Bersih</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4 pb-8">
          <ul className="px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className="mb-2">
                  <Link 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-700 text-white font-medium shadow-md' 
                        : 'text-blue-100 hover:bg-blue-700/50'}
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
          PDAM Desa © 2025
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;