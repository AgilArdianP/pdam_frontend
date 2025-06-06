import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                username,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setAuth(true);
            navigate("/");
        } catch (err) {
            setError("Login gagal. Username atau password salah.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-gray-400 to-blue-400 flex-col justify-center items-center p-12 text-white">
                <div className="max-w-md">   
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100" height="100">
                        <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#00BFFF"/>
                                <stop offset="100%" stop-color="#1E90FF"/>
                            </linearGradient>
                        </defs>
                        <path d="M32 4C20 20 12 30 12 42c0 11 9 18 20 18s20-7 20-18c0-12-8-22-20-38z"
                        fill="url(#blueGradient)"/>
                    </svg>

                    </div>
                    <h1 className="text-4xl font-bold mb-4">PDAM Desa</h1>
                    <p className="text-xl mb-6">Selamat Datang di Aplikasi Pengelolaan PDAM.</p>
                    <div className="bg-blue-500 p-6 rounded-lg">
                        <p className="italic text-blue-100">"Kami hadir untuk melayani kebutuhan air bersih anda."</p>
                    </div>
                </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md px-4 sm:px-6">
                    {/* Mobile logo (visible only on small screens) */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 64 64">
                                <defs>
                                    <linearGradient id="dropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="white" stopOpacity="1"/>
                                        <stop offset="100%" stopColor="white" stopOpacity="0.8"/>
                                    </linearGradient>
                                </defs>
                                <path d="M32 4C20 20 12 30 12 42c0 11 9 18 20 18s20-7 20-18c0-12-8-22-20-38z"
                                fill="url(#dropGradient)"/>
                            </svg>
                        </div>
                    </div>


                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
                        <p className="text-gray-600 mt-2">Aplikasi Pengelolaan PDAM Desa</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md border border-red-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col w-full h-full mt-6 bg-gray-200 p-10 md:p-6 rounded-lg shadow-md">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-black"
                                    placeholder="Masukkan username anda"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-gray-700 font-medium" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition">
                                    Lupa password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                            </div>
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-12 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-black"
                                placeholder="Masukkan password anda"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-1 right-0 pr-3 flex items-center text-white hover:text-gray-600 bg-black transition- focus:bg-gray-900"
                            >
                            {showPassword ? (
                            // Icon when password is visible (Eye Slash)
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                            ) : (
                            // Icon when password is hidden (Eye)
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            )}
                            </button>
                        </div>
                    </div>
                        
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Ingat saya
                            </label>
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : "Masuk"}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Belum memiliki akun? {" "}
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition">
                                Daftar sekarang
                            </a>
                        </p>
                    </div>

                    <div className="mt-12 border-t border-gray-200 pt-6">
                        <div className="flex justify-center space-x-4">
                            <a href="/termsofservice" className="text-gray-500 hover:text-gray-700">
                                Terms of Service
                            </a>
                            <a href="/privacypolice" className="text-gray-500 hover:text-gray-700">
                                Privacy Policy
                            </a>
                            <a href="/contact" className="text-gray-500 hover:text-gray-700">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;