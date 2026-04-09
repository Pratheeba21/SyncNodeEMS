
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import io from "socket.io-client";
import ChatDrawer from "./ChatDrawer";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import LeadDashboard from "./LeadDashboard";

const API_URL = "https://syncnodeems.onrender.com/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName"),
    role: localStorage.getItem("userRole"),
    lead_id: localStorage.getItem("leadId"),
    manager_id: localStorage.getItem("managerId"),
  });

  const [toasts, setToasts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token && user.id) {
      const newSocket = io("https://syncnodeems.onrender.com", {
        query: {
          userId: user.id,
          role: user.role,
          department: user.department || "General",
          leadId: user.lead_id || "null",
          managerId: user.manager_id || "null",
        },
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [token, user]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("leadId", userData.lead_id || "");
      localStorage.setItem("managerId", userData.manager_id || "");

      setToken(newToken);
      setUser(userData);
      showToast("Session Initialized", "success");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid Credentials";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    window.location.reload();
  };

  if (!token) return <LoginOverlay onLogin={handleLogin} />;

  const dashboardProps = { token, user, showToast, logout, socket };

  return (
    <div className="app-container">
      <div id="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {user.role === "Admin" && <AdminDashboard {...dashboardProps} />}
      {user.role === "Manager" && <ManagerDashboard {...dashboardProps} />}
      {user.role === "Lead" && <LeadDashboard {...dashboardProps} />}
      {user.role === "Employee" && <EmployeeDashboard {...dashboardProps} />}
    </div>
  );
}

function LoginOverlay({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uiError, setUiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError("");
    setLoading(true);
    const result = await onLogin(email, password);
    if (!result.success) setUiError(result.message);
    setLoading(false);
  };

  return (
    <div className="overlay">
      <div className="glass login-card">
        <h2>SyncNode Login</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
          <input
            className="glass-input"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="glass-input"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {uiError && (
            <div
              className="login-error-message"
              style={{
                color: "#ff4757",
                fontSize: "14px",
                textAlign: "center",
              }}>
              ⚠️ {uiError}
            </div>
          )}
          <button type="submit" className="action-btn" disabled={loading}>
            {loading ? "Verifying..." : "Initialize Session"}
          </button>
        </form>
      </div>
    </div>
  );
}