import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Usage from "./pages/Usage";
import Payments from "./pages/Payments";
import Tagihan from "./pages/Tagihan";
import Backup from "./pages/Backup";
import TarifManagement from "./pages/TarifManagement";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolice from "./pages/PrivacyPolice";
import Contact from "./pages/Contact";

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(!!token);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!localStorage.getItem("token")) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/termsofservice"
          element={<TermsOfService />}
        />
        <Route 
          path="/privacypolice"
          element={<PrivacyPolice />}
        />
        <Route 
          path="/contact"
          element={<Contact />}
        />
      <Route 
          path="/register"
          element={<Register />}
        />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usage"
          element={
            <ProtectedRoute>
              <Usage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/tagihan"
          element={
            <ProtectedRoute>
              <Tagihan />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/backup"
          element={
            <ProtectedRoute>
              <Backup />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/tarifmanagement"
          element={
            <ProtectedRoute>
              <TarifManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
