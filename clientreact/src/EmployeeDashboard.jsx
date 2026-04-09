

import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import "./App.css";
import { io } from "socket.io-client";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { Radar } from "react-chartjs-2";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  MessageSquare,
  Home,
  Folder,
  Clock,
  FileText,
  Calendar,
  LogOut,
} from "lucide-react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

// Import your components
import Dashboard from "./Dashboard";
import TaskCenter from "./TaskCenter";
import LeaveCenter from "./LeaveCenter";
import AttendanceTab from "./AttendanceTab";
import EODReportTab from "./EODReportTab";
import ChatDrawer from "./ChatDrawer";

const API_URL = "https://syncnodeems.onrender.com/api";
const SOCKET_URL = "https://syncnodeems.onrender.com";

export default function EmployeeDashboard({ token, user, showToast, logout }) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  // FIX: Initialize from localStorage to survive refreshes
  const [pulse, setPulse] = useState(() => {
    const savedPulse = localStorage.getItem(`pulse_${user?.id}`);
    return savedPulse || user?.pulseStatus || "Available";
  });

  const [attendance, setAttendance] = useState(null);
  const [timer, setTimer] = useState("00:00:00");
  const [socket, setSocket] = useState(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [token]);

  // SYNC PULSE STATUS: Updates DB and LocalStorage when 'pulse' changes
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const updatePulseStatus = async () => {
      try {
        // Persist locally for immediate consistency on refresh
        localStorage.setItem(`pulse_${user?.id}`, pulse);

        // Update Backend (Assuming endpoint exists in employee/admin router)
        // We use the same update-pulse endpoint if it's shared, or adjust path if needed
        await axios.patch(
          `${API_URL}/admin/update-pulse`,
          { pulseStatus: pulse },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (err) {
        console.error("Failed to sync pulse status:", err);
      }
    };

    updatePulseStatus();
  }, [pulse, token, user?.id]);

  const fetchAttendanceStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance/my-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [token]);

  useEffect(() => {
    let interval;
    if (attendance && attendance.checkInTime && !attendance.checkOutTime) {
      interval = setInterval(() => {
        const start = new Date(attendance.checkInTime);
        const now = new Date();
        const diff = Math.floor((now - start) / 1000);
        const h = Math.floor(diff / 3600)
          .toString()
          .padStart(2, "0");
        const m = Math.floor((diff % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const s = (diff % 60).toString().padStart(2, "0");
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    } else if (attendance?.checkInTime && attendance?.checkOutTime) {
      const start = new Date(attendance.checkInTime);
      const end = new Date(attendance.checkOutTime);
      const diff = Math.floor((end - start) / 1000);
      const h = Math.floor(diff / 3600)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const s = (diff % 60).toString().padStart(2, "0");
      setTimer(`${h}:${m}:${s}`);
    } else {
      setTimer("00:00:00");
    }
    return () => clearInterval(interval);
  }, [attendance]);

  const handleToggleCheck = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/attendance/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast(res.data.message, "success");
      fetchAttendanceStatus();
    } catch (err) {
      showToast(err.response?.data?.error || "Error", "error");
    }
  };

  return (
    <>
      <aside className="glass sidebar">
        <h2>SyncNode</h2>
        <div className="user-info">
          <div
            className="dot"
            style={{
              background: pulse === "Available" ? "#2ed573" : "#ffa502",
            }}></div>
          <span>{user.name}</span>
          <span
            className="badge"
            style={{ marginLeft: "10px", fontSize: "0.7rem", opacity: 0.7 }}>
            {user.role || "EMPLOYEE"}
          </span>
        </div>
        <hr className="divider" />
        <nav className="nav-menu">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}>
            <Home size={18} /> Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("messenger")}
            className={`nav-link ${currentPage === "messenger" ? "active" : ""}`}>
            <MessageSquare size={18} /> Messenger
          </button>
          <button
            onClick={() => setCurrentPage("tasks")}
            className={`nav-link ${currentPage === "tasks" ? "active" : ""}`}>
            <Folder size={18} /> Tasks
          </button>
          <button
            onClick={() => setCurrentPage("attendance")}
            className={`nav-link ${currentPage === "attendance" ? "active" : ""}`}>
            <Clock size={18} /> Attendance
          </button>

          <button
            onClick={() => setCurrentPage("eod")}
            className={`nav-link ${currentPage === "eod" ? "active" : ""}`}>
            <FileText size={18} /> EOD Reports
          </button>
          <button
            onClick={() => setCurrentPage("leave")}
            className={`nav-link ${currentPage === "leave" ? "active" : ""}`}>
            <Calendar size={18} /> Leave Center
          </button>
          <hr className="divider" />
          <button onClick={logout} className="nav-link logout">
            <RiLogoutCircleRLine size={18} /> Exit System
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="glass top-bar">
          <div className="header-left">
            <h1>
              {currentPage === "eod"
                ? "EOD Reports"
                : currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h1>
          </div>
          <div className="status-toggle-group">
            <button
              onClick={() => setPulse("Available")}
              className={`status-mini-btn ${pulse === "Available" ? "active-green" : ""}`}>
              Available
            </button>
            <button
              onClick={() => setPulse("Deep Work")}
              className={`status-mini-btn ${pulse === "Deep Work" ? "active-orange" : ""}`}>
              Deep Work
            </button>
          </div>
          <div className="header-right">
            {attendance?.checkInTime && (
              <span className="timer-display">
                Hours Worked Today: <strong>{timer}</strong>
              </span>
            )}
            <button
              className={`action-btn ${
                attendance?.checkInTime && !attendance?.checkOutTime
                  ? "btn-checkout"
                  : "btn-checkin"
              }`}
              onClick={handleToggleCheck}
              disabled={attendance?.checkOutTime}
              style={{
                background: attendance?.checkInTime
                  ? attendance?.checkOutTime
                    ? "#666"
                    : "#ff4757"
                  : "#2ed573",
                minWidth: "120px",
                color: "white",
              }}>
              {attendance?.checkInTime
                ? attendance?.checkOutTime
                  ? "Shift Ended"
                  : "Check Out"
                : "Check In"}
            </button>
          </div>
        </header>

        {currentPage === "dashboard" && (
          <Dashboard token={token} userId={user.id} showToast={showToast} />
        )}

        {currentPage === "messenger" && socket && (
          <ChatDrawer
            socket={socket}
            user={user}
            isOpen={true}
            isSidebarMode={true}
          />
        )}

        {currentPage === "tasks" && (
          <TaskCenter token={token} showToast={showToast} />
        )}
        {currentPage === "leave" && (
          <LeaveCenter token={token} showToast={showToast} />
        )}
        {currentPage === "attendance" && (
          <AttendanceTab
            token={token}
            todayRecord={attendance}
            liveTimer={timer}
          />
        )}
        {currentPage === "eod" && (
          <EODReportTab token={token} user={user} showToast={showToast} />
        )}
      </main>
    </>
  );
}
