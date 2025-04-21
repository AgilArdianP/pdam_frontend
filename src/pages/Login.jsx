import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
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
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center p-12 text-white">
                <div className="max-w-md">   
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Company Name</h1>
                    <p className="text-xl mb-6">Welcome to our platform. Sign in to access your account and continue your journey.</p>
                    <div className="bg-blue-500 p-6 rounded-lg">
                        <p className="italic text-blue-100">"This is a place where you can add a testimonial, company mission statement, or any other important message you want users to see."</p>
                    </div>
                </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md px-4 sm:px-6">
                    {/* Mobile logo (visible only on small screens) */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                        <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md border border-red-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="pl-10 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter your username"
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
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter your password"
                                    required
                                />
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
                            <a href="#" className="text-gray-500 hover:text-gray-700">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700">
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