import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  TrendingUp,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  ChevronDown,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [monthlyUsage, setMonthlyUsage] = useState([]);
  const token = localStorage.getItem("token");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [tahun, setTahun] = useState(currentYear.toString());
  const [bulan, setBulan] = useState(currentMonth);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch ringkasan data utama
        const statsRes = await axios.get(
          `http://localhost:5000/api/dashboard/stats?bulan=${bulan}&tahun=${tahun}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(statsRes.data);

        // Fetch data penggunaan air per bulan
        const monthlyUsageRes = await axios.get(
          `http://localhost:5000/api/dashboard/monthly-usage?tahun=${tahun}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Add previous year data for comparison (optional)
        const processedData = monthlyUsageRes.data.map(item => ({
          ...item,
          bulan_name: monthNames[item.bulan - 1],
        }));
        
        setMonthlyUsage(processedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bulan, tahun, token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const cards = [
    {
      title: "Jumlah Pemakaian Warga",
      value: `${stats.totalPenggunaan || 0}`,
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      subtitle: `Bulan ${monthNames[bulan - 1]} ${tahun}`
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${formatCurrency(stats.totalPembayaran || 0)}`,
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      subtitle: `Bulan ${monthNames[bulan - 1]} ${tahun}`
    },
    {
      title: "Total Tagihan",
      value: `Rp ${formatCurrency(stats.totalTagihan || 0)}`,
      icon: <CreditCard className="h-8 w-8 text-purple-500" />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      subtitle: `Bulan ${monthNames[bulan - 1]} ${tahun}`
    },
    {
      title: "Yang Belum Dibayar",
      value: `Rp ${formatCurrency(stats.outstanding || 0)}`,
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      subtitle: `Bulan ${monthNames[bulan - 1]} ${tahun}`
    },
  ];

  // Find data for selected month
  const selectedMonthData = monthlyUsage.find(item => item.bulan === bulan) || { total_penggunaan: 0 };

  // Custom tooltip component for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{monthNames[label - 1]}</p>
          <p className="text-blue-600">
            <span className="font-medium">Penggunaan: </span>
            {payload[0].value} m³
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  Ringkasan data untuk bulan {monthNames[bulan - 1]} {tahun}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                {/* Month Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="flex items-center justify-between w-full min-w-40 border border-gray-300 bg-black p-2 rounded-lg shadow-sm hover:bg-gray-500"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span>{monthNames[bulan - 1]}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showMonthDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-black border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {monthNames.map((month, index) => (
                        <button
                          key={index}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                            bulan === index + 1 ? "bg-gray-500" : ""
                          }`}
                          onClick={() => {
                            setBulan(index + 1);
                            setShowMonthDropdown(false);
                          }}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Year Input */}
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg shadow-sm min-w-28"
                  placeholder="Tahun"
                  min="2000"
                  max={currentYear}
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border shadow-sm p-6 transition-all hover:shadow-md ${card.bgColor} ${card.borderColor}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          {card.title}
                        </h3>
                        <p
                          className={`text-2xl font-bold mt-2 ${card.textColor}`}
                        >
                          {card.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {card.subtitle}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-white bg-opacity-70">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detail Card for Selected Month */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Detail Penggunaan Air - {monthNames[bulan - 1]} {tahun}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Informasi detail tentang penggunaan air pada bulan yang dipilih
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition">
                  <Download className="w-4 h-4" />
                  <span>Ekspor</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Penggunaan</h3>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {selectedMonthData.total_penggunaan} m³
                  </p>
                  {/* You can add comparison to previous month here */}
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Rata-rata Harian</h3>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {(selectedMonthData.total_penggunaan / 30).toFixed(1)} m³
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Perkiraan penggunaan per hari
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Efisiensi</h3>
                  {selectedMonthData.total_penggunaan > 0 ? (
                    <p className="text-3xl font-bold text-purple-700 mt-2">
                      Baik
                    </p>
                  ) : (
                    <p className="text-3xl font-bold text-purple-700 mt-2">
                      -
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Berdasarkan riwayat penggunaan
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Penggunaan Air per Bulan (m³)
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Grafik penggunaan air sepanjang tahun {tahun}
                  </p>
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
              
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="bulan" 
                    tickFormatter={(tick) => monthNames[tick - 1]} 
                    tick={{fontSize: 12}}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{fontSize: 12}}
                    label={{ value: 'Penggunaan (m³)', angle: -90, position: 'insideLeft', offset: -5 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="total_penggunaan" 
                    name="Penggunaan Air" 
                    fill="#4F46E5" 
                    radius={[4, 4, 0, 0]}
                    yAxisId="left"
                  />
                  <Line
                    type="monotone"
                    dataKey="total_penggunaan"
                    stroke="#1E40AF"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Tren Penggunaan"
                    yAxisId="left"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">Penggunaan Tertinggi</span>
                  <span className="text-lg font-medium text-gray-800">
                    {Math.max(...monthlyUsage.map(item => item.total_penggunaan || 0))} m³
                  </span>
                  <span className="text-xs text-gray-500">
                    {monthNames[monthlyUsage.reduce((max, item) => 
                      (item.total_penggunaan > (monthlyUsage[max]?.total_penggunaan || 0)) ? monthlyUsage.indexOf(item) : max, 0)]}
                  </span>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">Penggunaan Terendah</span>
                  <span className="text-lg font-medium text-gray-800">
                    {Math.min(...monthlyUsage.filter(item => item.total_penggunaan > 0).map(item => item.total_penggunaan || 0)) || 0} m³
                  </span>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">Rata-rata Bulanan</span>
                  <span className="text-lg font-medium text-gray-800">
                    {monthlyUsage.length > 0 
                      ? (monthlyUsage.reduce((sum, item) => sum + (item.total_penggunaan || 0), 0) / monthlyUsage.filter(item => item.total_penggunaan > 0).length).toFixed(1) 
                      : 0} m³
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
          © {tahun} Dashboard Sistem. Semua hak dilindungi.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;