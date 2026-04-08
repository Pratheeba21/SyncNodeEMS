
// import React, { useState, useEffect, useRef, useMemo } from "react";
// import axios from "axios";
// import "./App.css";
// import { io } from "socket.io-client";
// import { RiLogoutCircleRLine } from "react-icons/ri";

// import { Radar } from "react-chartjs-2";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
// } from "recharts";
// import {
//   MessageSquare,
//   Home,
//   Folder,
//   Clock,
//   FileText,
//   Calendar,
//   LogOut,
// } from "lucide-react";

// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
// );

// // Import your components
// import Dashboard from "./Dashboard";
// import TaskCenter from "./TaskCenter";
// import LeaveCenter from "./LeaveCenter";
// import AttendanceTab from "./AttendanceTab";
// import EODReportTab from "./EODReportTab"; // Added New Component Import
// import ChatDrawer from "./ChatDrawer";


// const API_URL = "http://localhost:5000/api";
// const SOCKET_URL = "http://localhost:5000";


// export default function EmployeeDashboard({ token, user, showToast, logout }) {
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [pulse, setPulse] = useState("Available");
//   const [attendance, setAttendance] = useState(null);
//   const [timer, setTimer] = useState("00:00:00");
//     const [socket, setSocket] = useState(null);
//   const initialSyncDone = useRef(false);

//   useEffect(() => {
//       const newSocket = io(SOCKET_URL, {
//         auth: { token },
//       });
//       setSocket(newSocket);
  
//       return () => newSocket.close();
//     }, [token]);
  

//   const fetchAttendanceStatus = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/attendance/my-stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAttendance(res.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceStatus();
//   }, [token]);

//   useEffect(() => {
//     let interval;
//     if (attendance && attendance.checkInTime && !attendance.checkOutTime) {
//       interval = setInterval(() => {
//         const start = new Date(attendance.checkInTime);
//         const now = new Date();
//         const diff = Math.floor((now - start) / 1000);
//         const h = Math.floor(diff / 3600)
//           .toString()
//           .padStart(2, "0");
//         const m = Math.floor((diff % 3600) / 60)
//           .toString()
//           .padStart(2, "0");
//         const s = (diff % 60).toString().padStart(2, "0");
//         setTimer(`${h}:${m}:${s}`);
//       }, 1000);
//     } else if (attendance?.checkInTime && attendance?.checkOutTime) {
//       const start = new Date(attendance.checkInTime);
//       const end = new Date(attendance.checkOutTime);
//       const diff = Math.floor((end - start) / 1000);
//       const h = Math.floor(diff / 3600)
//         .toString()
//         .padStart(2, "0");
//       const m = Math.floor((diff % 3600) / 60)
//         .toString()
//         .padStart(2, "0");
//       const s = (diff % 60).toString().padStart(2, "0");
//       setTimer(`${h}:${m}:${s}`);
//     } else {
//       setTimer("00:00:00");
//     }
//     return () => clearInterval(interval);
//   }, [attendance]);

//   const handleToggleCheck = async () => {
//     try {
//       const res = await axios.post(
//         `${API_URL}/attendance/toggle`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast(res.data.message, "success");
//       fetchAttendanceStatus();
//     } catch (err) {
//       showToast(err.response?.data?.error || "Error", "error");
//     }
//   };

//   return (
//     <>
//       <aside className="glass sidebar">
//         <h2>SyncNode</h2>
//         <div className="user-info">
//           <div
//             className="dot"
//             style={{
//               background: pulse === "Available" ? "#2ed573" : "#ffa502",
//             }}></div>
//           <span>{user.name}</span>
//           <span
//             className="badge"
//             style={{ marginLeft: "10px", fontSize: "0.7rem", opacity: 0.7 }}>
//             {user.role || "EMPLOYEE"}
//           </span>
//         </div>
//         <hr className="divider" />
//         <nav className="nav-menu">
//           <button
//             onClick={() => setCurrentPage("dashboard")}
//             className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}>
//             <Home size={18} /> Dashboard
//           </button>
//           <button
//             onClick={() => setCurrentPage("messenger")}
//             className={`nav-link ${currentPage === "messenger" ? "active" : ""}`}>
//             <MessageSquare size={18} /> Messenger
//           </button>
//           <button
//             onClick={() => setCurrentPage("tasks")}
//             className={`nav-link ${currentPage === "tasks" ? "active" : ""}`}>
//             <Folder size={18} /> Tasks
//           </button>
//           <button
//             onClick={() => setCurrentPage("attendance")}
//             className={`nav-link ${currentPage === "attendance" ? "active" : ""}`}>
//             <Clock size={18} /> Attendance
//           </button>

//           <button
//             onClick={() => setCurrentPage("eod")}
//             className={`nav-link ${currentPage === "eod" ? "active" : ""}`}>
//             <FileText size={18} /> EOD Reports
//           </button>
//           <button
//             onClick={() => setCurrentPage("leave")}
//             className={`nav-link ${currentPage === "leave" ? "active" : ""}`}>
//             <Calendar size={18} /> Leave Center
//           </button>
//           <hr className="divider" />
//           <button onClick={logout} className="nav-link logout">
//             <RiLogoutCircleRLine size={18} /> Exit System
//           </button>
//         </nav>
//       </aside>

//       <main className="main-content">
//         <header className="glass top-bar">
//           <div className="header-left">
//             <h1>
//               {currentPage === "eod"
//                 ? "EOD Reports"
//                 : currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
//             </h1>
//           </div>
//           <div className="status-toggle-group">
//             <button
//               onClick={() => setPulse("Available")}
//               className={`status-mini-btn ${pulse === "Available" ? "active-green" : ""}`}>
//               Available
//             </button>
//             <button
//               onClick={() => setPulse("Deep Work")}
//               className={`status-mini-btn ${pulse === "Deep Work" ? "active-orange" : ""}`}>
//               Deep Work
//             </button>
//           </div>
//           <div className="header-right">
//             {attendance?.checkInTime && (
//               <span className="timer-display">
//                 Hours Worked Today: <strong>{timer}</strong>
//               </span>
//             )}
//             <button
//               className={`action-btn ${
//                 attendance?.checkInTime && !attendance?.checkOutTime
//                   ? "btn-checkout"
//                   : "btn-checkin"
//               }`}
//               onClick={handleToggleCheck}
//               disabled={attendance?.checkOutTime}
//               style={{
//                 background: attendance?.checkInTime
//                   ? attendance?.checkOutTime
//                     ? "#666"
//                     : "#ff4757"
//                   : "#2ed573",
//                 minWidth: "120px",
//                 color: "white",
//               }}>
//               {attendance?.checkInTime
//                 ? attendance?.checkOutTime
//                   ? "Shift Ended"
//                   : "Check Out"
//                 : "Check In"}
//             </button>
//           </div>
//         </header>

//         {/* Content Area Rendering */}
//         {currentPage === "dashboard" && (
//           <Dashboard token={token} userId={user.id} showToast={showToast} />
//         )}

//         {currentPage === "messenger" && socket && (
//           <ChatDrawer
//             socket={socket}
//             user={user}
//             isOpen={true}
//             isSidebarMode={true}
//           />
//         )}

//         {currentPage === "tasks" && (
//           <TaskCenter token={token} showToast={showToast} />
//         )}
//         {currentPage === "leave" && (
//           <LeaveCenter token={token} showToast={showToast} />
//         )}
//         {currentPage === "attendance" && (
//           <AttendanceTab
//             token={token}
//             todayRecord={attendance}
//             liveTimer={timer}
//           />
//         )}
//         {/* Render the EOD Tab */}
//         {currentPage === "eod" && (
//           <EODReportTab token={token} user={user} showToast={showToast} />
//         )}
//       </main>
//     </>
//   );
// }


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

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

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

// /* ---------------- ATTENDANCE TAB ---------------- */
// function AttendanceTab({ token, todayRecord, liveTimer }) {
//   const [history, setHistory] = useState([]);
//   const [viewDate, setViewDate] = useState(new Date());
//   const [hoveredDay, setHoveredDay] = useState(null);
//   const [hoverTimeout, setHoverTimeout] = useState(null);

//   const years = [2024, 2025, 2026];
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const fetchHistory = async () => {
//     try {
//       const year = viewDate.getFullYear();
//       const month = viewDate.getMonth() + 1;
//       const res = await axios.get(
//         `${API_URL}/attendance/history/${year}/${month}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       setHistory(res.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [viewDate, token]);

//   const daysInMonth = new Date(
//     viewDate.getFullYear(),
//     viewDate.getMonth() + 1,
//     0,
//   ).getDate();
//   const firstDay = new Date(
//     viewDate.getFullYear(),
//     viewDate.getMonth(),
//     1,
//   ).getDay();

//   // Helper to format time and check lateness
//   const formatTime = (dateStr) => {
//     if (!dateStr) return null;
//     const date = new Date(dateStr);
//     const timeString = date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     // Suggestion: Color coding (Late if after 09:30 AM)
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const isLate = hours > 9 || (hours === 9 && minutes > 30);

//     return { timeString, isLate };
//   };

//   const calculateDuration = (start, end) => {
//     if (!start) return "0h 0m";
//     const startTime = new Date(start);
//     const endTime = end ? new Date(end) : new Date();
//     const diffMs = endTime - startTime;
//     const diffHrs = Math.floor(diffMs / 3600000);
//     const diffMins = Math.floor((diffMs % 3600000) / 60000);
//     return `${diffHrs}h ${diffMins}m`;
//   };

//   const getRecordForDay = (day) => {
//     const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
//     return history.find((h) => h.date === dateStr);
//   };

//   const handleMouseEnter = (day) => {
//     const timeout = setTimeout(() => {
//       setHoveredDay(day);
//     }, 200); // 200ms delay to prevent flashing
//     setHoverTimeout(timeout);
//   };

//   const handleMouseLeave = () => {
//     if (hoverTimeout) clearTimeout(hoverTimeout);
//     setHoveredDay(null);
//   };

//   return (
//     <section className="page-content">
//       <div
//         className="dashboard-grid"
//         style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: "20px" }}>
//         <div className="glass card">
//           <small>Today's Check-in</small>
//           <h3>
//             {todayRecord?.checkInTime
//               ? new Date(todayRecord.checkInTime).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })
//               : "--:--"}
//           </h3>
//         </div>
//         <div className="glass card">
//           <small>Total Hours Today</small>
//           <h3>{liveTimer}</h3>
//         </div>
//         <div className="glass card">
//           <small>Month Absent Count</small>
//           <h3 style={{ color: "#ff4757" }}>
//             {daysInMonth - history.length - 4 /* Simplified logic */}
//           </h3>
//         </div>
//       </div>

//       <div className="glass card">
//         <div
//           className="calendar-controls"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "20px",
//           }}>
//           <button
//             className="action-btn small"
//             onClick={() =>
//               setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))
//             }>
//             {"<"}
//           </button>
//           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             <h3>{months[viewDate.getMonth()]}</h3>
//             <select
//               className="custom-select"
//               value={viewDate.getFullYear()}
//               onChange={(e) =>
//                 setViewDate(new Date(viewDate.setFullYear(e.target.value)))
//               }>
//               {years.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             className="action-btn small"
//             onClick={() =>
//               setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))
//             }>
//             {">"}
//           </button>
//         </div>

//         <div
//           className="calendar-grid"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(7, 1fr)",
//             gap: "8px",
//           }}>
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div
//               key={d}
//               style={{
//                 background: "rgba(0,0,0,0.3)",
//                 padding: "10px",
//                 textAlign: "center",
//                 borderRadius: "5px",
//                 fontSize: "0.8rem",
//               }}>
//               {d}
//             </div>
//           ))}
//           {Array(firstDay)
//             .fill(null)
//             .map((_, i) => (
//               <div key={`empty-${i}`}></div>
//             ))}

//           {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
//             const record = getRecordForDay(day);
//             const dateObj = new Date(
//               viewDate.getFullYear(),
//               viewDate.getMonth(),
//               day,
//             );
//             const isFuture = dateObj > new Date();
//             const isSunday = dateObj.getDay() === 0;

//             return (
//               <div
//                 key={day}
//                 className="calendar-cell"
//                 onMouseEnter={() => !isFuture && handleMouseEnter(day)}
//                 onMouseLeave={handleMouseLeave}
//                 style={{
//                   background: isFuture ? "rgba(255,255,255,0.05)" : "#fff",
//                   color: "#000",
//                   height: "70px",
//                   borderRadius: "8px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   position: "relative",
//                   cursor: isFuture ? "default" : "pointer",
//                   transition: "transform 0.2s",
//                 }}>
//                 <span
//                   style={{
//                     fontSize: "0.7rem",
//                     opacity: 0.5,
//                     position: "absolute",
//                     top: "5px",
//                     left: "8px",
//                   }}>
//                   {day}
//                 </span>

//                 {record ? (
//                   <span
//                     style={{
//                       color: "#2ed573",
//                       fontWeight: "bold",
//                       fontSize: "1.2rem",
//                     }}>
//                     P
//                   </span>
//                 ) : (
//                   !isFuture &&
//                   !isSunday && (
//                     <span
//                       style={{
//                         color: "#ff4757",
//                         fontWeight: "bold",
//                         fontSize: "1.2rem",
//                       }}>
//                       A
//                     </span>
//                   )
//                 )}

//                 {/* --- TOOLTIP --- */}
//                 {hoveredDay === day && !isFuture && (
//                   <div className="attendance-tooltip">
//                     {record ? (
//                       <>
//                         <div className="tooltip-row">
//                           <span>Check-In:</span>
//                           <span
//                             style={{
//                               color: formatTime(record.checkInTime).isLate
//                                 ? "#ff4757"
//                                 : "#2ed573",
//                             }}>
//                             {formatTime(record.checkInTime).timeString}
//                           </span>
//                         </div>
//                         <div className="tooltip-row">
//                           <span>Check-Out:</span>
//                           <span>
//                             {record.checkOutTime
//                               ? formatTime(record.checkOutTime).timeString
//                               : "Active"}
//                           </span>
//                         </div>
//                         <hr
//                           style={{
//                             border: "0.5px solid rgba(255,255,255,0.1)",
//                             margin: "5px 0",
//                           }}
//                         />
//                         <div
//                           className="tooltip-row"
//                           style={{ fontWeight: "bold" }}>
//                           <span>Total:</span>
//                           <span>
//                             {calculateDuration(
//                               record.checkInTime,
//                               record.checkOutTime,
//                             )}
//                           </span>
//                         </div>
//                       </>
//                     ) : (
//                       <div style={{ textAlign: "center", fontSize: "0.8rem" }}>
//                         {isSunday
//                           ? "Weekend - No Record"
//                           : "No records found for this date."}
//                       </div>
//                     )}
//                     <div className="tooltip-arrow"></div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- ATTENDANCE TAB ---------------- */
// function AttendanceTab({ token, todayRecord, liveTimer }) {
//   const [history, setHistory] = useState([]);
//   const [viewDate, setViewDate] = useState(new Date());
//   const [hoveredDay, setHoveredDay] = useState(null);
//   const [hoverTimeout, setHoverTimeout] = useState(null);

//   const years = [2024, 2025, 2026];
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];

//   const fetchHistory = async () => {
//     try {
//       const year = viewDate.getFullYear();
//       const month = viewDate.getMonth() + 1;
//       const res = await axios.get(
//         `${API_URL}/attendance/history/${year}/${month}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setHistory(res.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [viewDate, token]);

//   const daysInMonth = new Date(
//     viewDate.getFullYear(),
//     viewDate.getMonth() + 1,
//     0
//   ).getDate();
//   const firstDay = new Date(
//     viewDate.getFullYear(),
//     viewDate.getMonth(),
//     1
//   ).getDay();

//   const formatTime = (dateStr) => {
//     if (!dateStr) return null;
//     const date = new Date(dateStr);
//     const timeString = date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const isLate = hours > 9 || (hours === 9 && minutes > 30);
//     return { timeString, isLate };
//   };

//   const calculateDuration = (start, end) => {
//     if (!start) return "0h 0m";
//     const startTime = new Date(start);
//     const endTime = end ? new Date(end) : new Date();
//     const diffMs = endTime - startTime;
//     const diffHrs = Math.floor(diffMs / 3600000);
//     const diffMins = Math.floor((diffMs % 3600000) / 60000);
//     return `${diffHrs}h ${diffMins}m`;
//   };

//   const getRecordForDay = (day) => {
//     const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
//     return history.find((h) => h.date === dateStr);
//   };

//   const handleMouseEnter = (day) => {
//     const timeout = setTimeout(() => {
//       setHoveredDay(day);
//     }, 200);
//     setHoverTimeout(timeout);
//   };

//   const handleMouseLeave = () => {
//     if (hoverTimeout) clearTimeout(hoverTimeout);
//     setHoveredDay(null);
//   };

//   return (
//     <section 
//       className="page-content" 
//       style={{ 
//         height: "100%", 
//         overflow: "hidden", 
//         display: "flex", 
//         flexDirection: "column",
//         paddingBottom: "10px" 
//       }}
//     >
//       <div
//         className="dashboard-grid"
//         style={{
//           gridTemplateColumns: "1fr 1fr 1fr",
//           marginBottom: "15px",
//           flexShrink: 0
//         }}
//       >
//         <div className="glass card">
//           <small>Today's Check-in</small>
//           <h3>
//             {todayRecord?.checkInTime
//               ? formatTime(todayRecord.checkInTime).timeString
//               : "--:--"}
//           </h3>
//         </div>
//         <div className="glass card">
//           <small>Total Hours Today</small>
//           <h3>{liveTimer}</h3>
//         </div>
//         <div className="glass card">
//           <small>Month Absent Count</small>
//           <h3 style={{ color: "#ff4757" }}>
//             {daysInMonth - history.length - 4}
//           </h3>
//         </div>
//       </div>

//       <div className="glass card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
//         <div
//           className="calendar-controls"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "15px",
//             flexShrink: 0
//           }}
//         >
//           <button
//             className="action-btn small"
//             onClick={() =>
//               setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))
//             }
//           >
//             {"<"}
//           </button>
//           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             <h3>{months[viewDate.getMonth()]}</h3>
//             <select
//               className="custom-select"
//               value={viewDate.getFullYear()}
//               onChange={(e) =>
//                 setViewDate(new Date(viewDate.setFullYear(e.target.value)))
//               }
//             >
//               {years.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             className="action-btn small"
//             onClick={() =>
//               setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))
//             }
//           >
//             {">"}
//           </button>
//         </div>

//         <div
//           className="calendar-grid"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(7, 1fr)",
//             gap: "8px",
//             flex: 1,
//             overflowY: "auto", // Only the calendar grid will scroll if content overflows
//             paddingRight: "5px" 
//           }}
//         >
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div
//               key={d}
//               style={{
//                 background: "rgba(0,0,0,0.3)",
//                 padding: "8px",
//                 textAlign: "center",
//                 borderRadius: "5px",
//                 fontSize: "0.75rem",
//               }}
//             >
//               {d}
//             </div>
//           ))}
//           {Array(firstDay)
//             .fill(null)
//             .map((_, i) => (
//               <div key={`empty-${i}`}></div>
//             ))}
//           {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
//             const record = getRecordForDay(day);
//             const dateObj = new Date(
//               viewDate.getFullYear(),
//               viewDate.getMonth(),
//               day
//             );
//             const isFuture = dateObj > new Date();
//             const isSunday = dateObj.getDay() === 0;

//             return (
//               <div
//                 key={day}
//                 className="calendar-cell"
//                 onMouseEnter={() => !isFuture && handleMouseEnter(day)}
//                 onMouseLeave={handleMouseLeave}
//                 style={{
//                   background: isFuture ? "rgba(255,255,255,0.05)" : "#fff",
//                   color: "#000",
//                   height: "60px",
//                   borderRadius: "8px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   position: "relative",
//                   cursor: isFuture ? "default" : "pointer",
//                   transition: "transform 0.2s",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: "0.65rem",
//                     opacity: 0.5,
//                     position: "absolute",
//                     top: "4px",
//                     left: "6px",
//                   }}
//                 >
//                   {day}
//                 </span>
//                 {record ? (
//                   <span
//                     style={{
//                       color: "#2ed573",
//                       fontWeight: "bold",
//                       fontSize: "1.1rem",
//                     }}
//                   >
//                     P
//                   </span>
//                 ) : (
//                   !isFuture &&
//                   !isSunday && (
//                     <span
//                       style={{
//                         color: "#ff4757",
//                         fontWeight: "bold",
//                         fontSize: "1.1rem",
//                       }}
//                     >
//                       A
//                     </span>
//                   )
//                 )}

//                 {hoveredDay === day && !isFuture && (
//                   <div className="attendance-tooltip">
//                     {record ? (
//                       <>
//                         <div className="tooltip-row">
//                           <span>Check-In:</span>
//                           <span
//                             style={{
//                               color: formatTime(record.checkInTime).isLate
//                                 ? "#ff4757"
//                                 : "#2ed573",
//                             }}
//                           >
//                             {formatTime(record.checkInTime).timeString}
//                           </span>
//                         </div>
//                         <div className="tooltip-row">
//                           <span>Check-Out:</span>
//                           <span>
//                             {record.checkOutTime
//                               ? formatTime(record.checkOutTime).timeString
//                               : "Active"}
//                           </span>
//                         </div>
//                         <hr
//                           style={{
//                             border: "0.5px solid rgba(255,255,255,0.1)",
//                             margin: "5px 0",
//                           }}
//                         />
//                         <div
//                           className="tooltip-row"
//                           style={{ fontWeight: "bold" }}
//                         >
//                           <span>Total:</span>
//                           <span>
//                             {calculateDuration(
//                               record.checkInTime,
//                               record.checkOutTime
//                             )}
//                           </span>
//                         </div>
//                       </>
//                     ) : (
//                       <div style={{ textAlign: "center", fontSize: "0.8rem" }}>
//                         {isSunday
//                           ? "Weekend - No Record"
//                           : "No records found."}
//                       </div>
//                     )}
//                     <div className="tooltip-arrow"></div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


// /* ---------------- DASHBOARD ---------------- */

// function Dashboard({ token, userId, showToast }) {
//   const [talents, setTalents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [deptFilter, setDeptFilter] = useState("All Departments");
//   const [roleFilter, setRoleFilter] = useState("All Roles");

//   const fetchTalent = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/admin/talent-hub`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTalents(res.data);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//       showToast("Could not load talent hub data", "error");
//     }
//   };

//   useEffect(() => {
//     fetchTalent();
//   }, [token]);

//   // 1. Extract Unique Departments
//   const departments = useMemo(() => {
//     const set = new Set(talents.map(t => t.department).filter(Boolean));
//     return ["All Departments", ...Array.from(set).sort()];
//   }, [talents]);

//   // 2. Extract Unique Roles
//   const roles = useMemo(() => {
//     // Now that 'role' is included in the backend response, this will work
//     const set = new Set(talents.map(t => t.role).filter(Boolean));
//     return ["All Roles", ...Array.from(set).sort()];
//   }, [talents]);

//   // 3. Combined Filter Logic
//   const filteredTalents = useMemo(() => {
//     return talents.filter((t) => {
//       const nameMatch = t.name?.toLowerCase().includes(searchQuery.toLowerCase());
//       const deptMatch = deptFilter === "All Departments" || t.department === deptFilter;
//       const roleMatch = roleFilter === "All Roles" || t.role === roleFilter;

//       return nameMatch && deptMatch && roleMatch;
//     });
//   }, [talents, searchQuery, deptFilter, roleFilter]);

//   const handleEndorse = async (targetId) => {
//     try {
//       await axios.post(
//         `${API_URL}/employee/endorse/${targetId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast("Endorsed!", "success");
//       fetchTalent();
//     } catch (err) {
//       showToast(err.response?.data?.error || "Error", "error");
//     }
//   };

//   const selectStyle = {
//     background: "rgba(255, 255, 255, 0.05)",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//     borderRadius: "6px",
//     padding: "4px 8px",
//     color: "white",
//     fontSize: "0.75rem",
//     outline: "none",
//     cursor: "pointer"
//   };

//   return (
//     <section className="page-content" style={{ height: "calc(100vh - 120px)", paddingBottom: "20px" }}>
//       <div className="dashboard-grid" style={{ display: "flex", gap: "20px", height: "100%" }}>
        
//         {/* Left Side: Performance Visualization */}
//         <div className="glass card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
//           <h3 style={{ marginBottom: "15px" }}>Performance</h3>
//           <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
//             <Radar
//               data={{
//                 labels: ["Tasks", "Speed", "Quality", "On-Time", "Skills"],
//                 datasets: [
//                   {
//                     label: "Team Average",
//                     data: [85, 92, 78, 90, 88],
//                     backgroundColor: "rgba(0, 242, 254, 0.2)",
//                     borderColor: "#00f2fe",
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                   r: {
//                     grid: { color: "rgba(255,255,255,0.1)" },
//                     pointLabels: { color: "white" },
//                   },
//                 },
//                 plugins: { legend: { display: false } },
//               }}
//             />
//           </div>
//         </div>

//         {/* Right Side: Talent Hub */}
//         <div className="glass card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
//           <div style={{ marginBottom: "15px" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
//               <h3 style={{ margin: 0 }}>Talent Hub ({filteredTalents.length})</h3>
//               <input
//                 type="text"
//                 placeholder="Search name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ ...selectStyle, width: "140px", padding: "6px 12px" }}
//               />
//             </div>
            
//             <div style={{ display: "flex", gap: "10px" }}>
//               <select 
//                 value={deptFilter} 
//                 onChange={(e) => setDeptFilter(e.target.value)}
//                 style={{ ...selectStyle, flex: 1 }}
//               >
//                 {departments.map(dept => (
//                   <option key={dept} value={dept} style={{ background: "#1a1a1a" }}>{dept}</option>
//                 ))}
//               </select>

//               <select 
//                 value={roleFilter} 
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 style={{ ...selectStyle, flex: 1 }}
//               >
//                 {roles.map(role => (
//                   <option key={role} value={role} style={{ background: "#1a1a1a" }}>{role}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="talent-list-scroll" style={{ overflowY: "auto", paddingRight: "5px", flex: 1, minHeight: 0 }}>
//             {filteredTalents.length > 0 ? (
//               filteredTalents.map((t) => (
//                 <div key={t._id} className="talent-item glass" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", marginBottom: "10px" }}>
//                   <div>
//                     <strong>{t.name} {t._id === userId && "(You)"}</strong>
//                     <br />
//                     <small style={{ opacity: 0.7 }}>
//                       {t.role || "Member"} • {t.department || "General"}
//                     </small>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <span style={{ marginRight: "10px", fontSize: "0.9rem" }}>
//                       ⭐ {t.performance?.endorsements || 0}
//                     </span>
//                     <button
//                       className="action-btn small"
//                       disabled={t._id === userId || t.performance?.endorsedBy?.includes(userId)}
//                       onClick={() => handleEndorse(t._id)}
//                     >
//                       {t.performance?.endorsedBy?.includes(userId) ? "Endorsed" : "Endorse"}
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div style={{ textAlign: "center", opacity: 0.5, marginTop: "40px" }}>
//                 No employees match these filters.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- DASHBOARD (SCROLLBAR FIXED) ---------------- */

// function Dashboard({ token, userId, showToast }) {
//   const [talents, setTalents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [deptFilter, setDeptFilter] = useState("All Departments");
//   const [roleFilter, setRoleFilter] = useState("All Roles");

//   const fetchTalent = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/admin/talent-hub`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTalents(res.data);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//       showToast("Could not load talent hub data", "error");
//     }
//   };

//   useEffect(() => {
//     fetchTalent();
//   }, [token]);

//   const departments = useMemo(() => {
//     const set = new Set(talents.map(t => t.department).filter(Boolean));
//     return ["All Departments", ...Array.from(set).sort()];
//   }, [talents]);

//   const roles = useMemo(() => {
//     const set = new Set(talents.map(t => t.role).filter(Boolean));
//     return ["All Roles", ...Array.from(set).sort()];
//   }, [talents]);

//   const filteredTalents = useMemo(() => {
//     return talents.filter((t) => {
//       const nameMatch = t.name?.toLowerCase().includes(searchQuery.toLowerCase());
//       const deptMatch = deptFilter === "All Departments" || t.department === deptFilter;
//       const roleMatch = roleFilter === "All Roles" || t.role === roleFilter;
//       return nameMatch && deptMatch && roleMatch;
//     });
//   }, [talents, searchQuery, deptFilter, roleFilter]);

//   const handleEndorse = async (targetId) => {
//     try {
//       await axios.post(
//         `${API_URL}/employee/endorse/${targetId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast("Endorsed!", "success");
//       fetchTalent();
//     } catch (err) {
//       showToast(err.response?.data?.error || "Error", "error");
//     }
//   };

//   const selectStyle = {
//     background: "rgba(255, 255, 255, 0.05)",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//     borderRadius: "6px",
//     padding: "4px 8px",
//     color: "white",
//     fontSize: "0.75rem",
//     outline: "none",
//     cursor: "pointer"
//   };

//   return (
//     <section 
//       className="page-content" 
//       style={{ 
//         height: "calc(100vh - 120px)", // Matches your layout
//         overflow: "hidden",            // Prevents main section from scrolling
//         padding: "0 20px 20px 20px",    // Balanced padding
//         boxSizing: "border-box"
//       }}
//     >
//       <div 
//         className="dashboard-grid" 
//         style={{ 
//           display: "flex", 
//           gap: "20px", 
//           height: "100%",              // Uses the full height of section
//           alignItems: "stretch" 
//         }}
//       >
        
//         {/* Left Side: Performance Visualization */}
//         <div 
//           className="glass card" 
//           style={{ 
//             flex: 1, 
//             display: "flex", 
//             flexDirection: "column", 
//             minWidth: 0, 
//             minHeight: 0,
//             padding: "20px" 
//           }}
//         >
//           <h3 style={{ marginBottom: "15px", marginTop: 0 }}>Performance</h3>
//           <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
//             <Radar
//               data={{
//                 labels: ["Tasks", "Speed", "Quality", "On-Time", "Skills"],
//                 datasets: [
//                   {
//                     label: "Team Average",
//                     data: [85, 92, 78, 90, 88],
//                     backgroundColor: "rgba(0, 242, 254, 0.2)",
//                     borderColor: "#00f2fe",
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                   r: {
//                     grid: { color: "rgba(255,255,255,0.1)" },
//                     pointLabels: { color: "white" },
//                   },
//                 },
//                 plugins: { legend: { display: false } },
//               }}
//             />
//           </div>
//         </div>

//         {/* Right Side: Talent Hub */}
//         <div 
//           className="glass card" 
//           style={{ 
//             flex: 1, 
//             display: "flex", 
//             flexDirection: "column", 
//             minWidth: 0, 
//             minHeight: 0,
//             padding: "20px"
//           }}
//         >
//           <div style={{ marginBottom: "15px" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
//               <h3 style={{ margin: 0 }}>Talent Hub ({filteredTalents.length})</h3>
//               <input
//                 type="text"
//                 placeholder="Search name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ ...selectStyle, width: "140px", padding: "6px 12px" }}
//               />
//             </div>
            
//             <div style={{ display: "flex", gap: "10px" }}>
//               <select 
//                 value={deptFilter} 
//                 onChange={(e) => setDeptFilter(e.target.value)}
//                 style={{ ...selectStyle, flex: 1 }}
//               >
//                 {departments.map(dept => (
//                   <option key={dept} value={dept} style={{ background: "#1a1a1a" }}>{dept}</option>
//                 ))}
//               </select>

//               <select 
//                 value={roleFilter} 
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 style={{ ...selectStyle, flex: 1 }}
//               >
//                 {roles.map(role => (
//                   <option key={role} value={role} style={{ background: "#1a1a1a" }}>{role}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {/* Scrollable List container */}
//           <div 
//             className="talent-list-scroll" 
//             style={{ 
//               overflowY: "auto", 
//               paddingRight: "5px", 
//               flex: 1, 
//               minHeight: 0,
//               scrollbarWidth: "thin" 
//             }}
//           >
//             <style>
//               {`
//                 .talent-list-scroll::-webkit-scrollbar { width: 5px; }
//                 .talent-list-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
//               `}
//             </style>
//             {filteredTalents.length > 0 ? (
//               filteredTalents.map((t) => (
//                 <div key={t._id} className="talent-item glass" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", marginBottom: "10px", background: "rgba(255,255,255,0.02)" }}>
//                   <div>
//                     <strong style={{ fontSize: "0.9rem" }}>{t.name} {t._id === userId && "(You)"}</strong>
//                     <br />
//                     <small style={{ opacity: 0.7, fontSize: "0.75rem" }}>
//                       {t.role || "Member"} • {t.department || "General"}
//                     </small>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <span style={{ marginRight: "10px", fontSize: "0.85rem" }}>
//                       ⭐ {t.performance?.endorsements || 0}
//                     </span>
//                     <button
//                       className="action-btn small"
//                       disabled={t._id === userId || t.performance?.endorsedBy?.includes(userId)}
//                       onClick={() => handleEndorse(t._id)}
//                       style={{ padding: "4px 10px", fontSize: "0.75rem" }}
//                     >
//                       {t.performance?.endorsedBy?.includes(userId) ? "Endorsed" : "Endorse"}
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div style={{ textAlign: "center", opacity: 0.5, marginTop: "40px", fontSize: "0.85rem" }}>
//                 No employees match these filters.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- TASK CENTER ---------------- */

// function TaskCenter({ token, showToast }) {
//   const [tasks, setTasks] = useState([]);
//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTasks(res.data.performance?.assignedTasks || []);
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   useEffect(() => {
//     fetchTasks();
//   }, [token]);

//   const updateStatus = async (taskId, newStatus) => {
//     try {
//       await axios.patch(
//         `${API_URL}/employee/update-task-status/${taskId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast(`Task moved to ${newStatus}`, "success");
//       fetchTasks();
//     } catch (e) {
//       showToast("Update failed", "error");
//     }
//   };

//   const calculateDuration = (start, end) => {
//     if (!start || !end) return "N/A";
//     const diff = new Date(end) - new Date(start);
//     const hours = Math.floor(diff / 3600000);
//     const mins = Math.floor((diff % 3600000) / 60000);
//     return `${hours}h ${mins}m`;
//   };

//   const activeTasks = tasks.filter((t) => t.status !== "Completed");
//   const oldTasks = tasks.filter((t) => t.status === "Completed");

//   return (
//     <section className="page-content">
//       {/* <header className="glass top-bar">
//         <h1>Task Management</h1>
//       </header> */}
//       <div className="glass card" style={{ marginBottom: "20px" }}>
//         <h3>Current Tasks</h3>
//         <table className="sync-table">
//           <thead>
//             <tr>
//               <th>Task Name</th>
//               <th>Assigned</th>
//               <th>Due Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activeTasks.map((t) => (
//               <tr key={t._id}>
//                 <td>{t.title}</td>
//                 <td>{new Date(t.assignedAt).toLocaleString()}</td>
//                 <td>{new Date(t.deadline).toLocaleString()}</td>
//                 <td>
//                   <div className="form-group">
//                     <div className="select-wrapper">
//                       <select
//                         className="custom-select "
//                         value={t.status}
//                         onChange={(e) => updateStatus(t._id, e.target.value)}>
//                         <option value="Pending">Pending</option>
//                         <option value="Planning">Planning</option>
//                         <option value="Processing">Processing</option>
//                         <option value="Completed">Completed</option>
//                       </select>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="glass card">
//         <h3>Task History</h3>
//         <table className="sync-table">
//           <thead>
//             <tr>
//               <th>Task Name</th>
//               <th>Assigned</th>
//               <th>Due</th>
//               <th>Completed</th>
//               <th>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {oldTasks.map((t) => (
//               <tr key={t._id}>
//                 <td>{t.title}</td>
//                 <td>{new Date(t.assignedAt).toLocaleString()}</td>
//                 <td>{new Date(t.deadline).toLocaleString()}</td>
//                 <td>{new Date(t.completedAt).toLocaleString()}</td>
//                 <td>
//                   <span className="time-badge">
//                     {calculateDuration(t.assignedAt, t.completedAt)}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }

/* ---------------- WORKFLOW COMMAND CENTER 3.0 (Analytics Console) ---------------- */

// function TaskCenter({ token, showToast }) {
//   const [tasks, setTasks] = useState([]);
//   const [activePopover, setActivePopover] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [now, setNow] = useState(new Date());

//   // Keep the "current time" fresh for accurate countdowns
//   useEffect(() => {
//     const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
//     return () => clearInterval(timer);
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allTasks = res.data.performance?.assignedTasks || [];
//       const currentTime = new Date();
//       const processedTasks = allTasks.map((t) => ({
//         ...t,
//         isAtRisk:
//           (t.status === "Pending" ||
//             t.status === "Planning" ||
//             t.status === "Processing") &&
//           new Date(t.deadline) < currentTime,
//       }));
//       setTasks(processedTasks);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [token]);

//   useEffect(() => {
//     const handleGlobalClick = () => setActivePopover(null);
//     if (activePopover) window.addEventListener("click", handleGlobalClick);
//     return () => window.removeEventListener("click", handleGlobalClick);
//   }, [activePopover]);

//   const updateStatus = async (taskId, newStatus, e) => {
//     if (e) e.stopPropagation();
//     try {
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
//       );
//       setActivePopover(null);
//       await axios.patch(
//         `${API_URL}/employee/update-task-status/${taskId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast(`Moved to ${newStatus}`, "success");
//     } catch (e) {
//       showToast("Sync failed", "error");
//       fetchTasks();
//     }
//   };

//   const calculateDuration = (start, end) => {
//     const s = new Date(start);
//     const e = new Date(end);
//     const diffMs = Math.abs(e - s);
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${minutes}m`;
//   };

//   const getTimeRemaining = (deadline) => {
//     const diff = new Date(deadline) - now;
//     if (diff <= 0) return null;

//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const mins = Math.floor((diff / 1000 / 60) % 60);

//     if (days > 0) return `${days}d ${hours}h remaining`;
//     if (hours > 0) return `${hours}h ${mins}m remaining`;
//     return `${mins}m remaining`;
//   };

//   const columnConfig = [
//     { id: "Pending", color: "#f1c40f" },
//     { id: "Planning", color: "#a29bfe" },
//     { id: "Processing", color: "#3498db" },
//     { id: "Completed", color: "#2ecc71" },
//   ];

//   const stats = useMemo(() => {
//     return columnConfig.map((col) => ({
//       name: col.id,
//       value: tasks.filter((t) => t.status === col.id).length,
//       color: col.color,
//     }));
//   }, [tasks]);

//   const attentionFeed = useMemo(() => {
//     return tasks.filter((t) => t.isAtRisk).slice(0, 4);
//   }, [tasks]);

//   const totalLoad = stats.reduce((sum, s) => sum + s.value, 0);
//   const completedTasks = tasks.filter((t) => t.status === "Completed" && t.completedAt);
//   const avgCycleTime = completedTasks.length > 0
//       ? completedTasks.reduce((sum, t) => sum + Math.abs(new Date(t.completedAt) - new Date(t.assignedAt || t.createdAt)), 0) / completedTasks.length
//       : null;

//   return (
//     <section className="page-content" style={{ padding: 0 }}>
//       <style>
//         {`
//         .console-container { padding: 20px; color: white; height: calc(100vh - 140px); overflow-y: auto; overflow-x: visible; }
//         .analytics-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; margin-bottom: 30px; }
//         .system-gauge-pane { background: var(--glass); border-radius: 20px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative; min-height: 240px; }
//         .at-risk-pane { background: rgba(0,0,0,0.2); border-radius: 20px; padding: 30px; }
//         .stat-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
//         .small-stat-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 15px; border-radius: 14px; text-align: center; cursor: pointer; transition: 0.2s; }
//         .small-stat-card:hover { background: var(--accent-soft); border-color: var(--accent); transform: translateY(-3px); }
//         .compact-task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
//         .compact-card { padding: 16px !important; border-radius: 12px !important; position: relative; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between; }
//         .task-title { font-size: 0.9rem; font-weight: 600; color: white; margin-bottom: 12px; }
//         .timestamp-label { font-size: 8px; text-transform: uppercase; color: var(--text-dim); }
//         .timestamp-value { font-size: 11px; color: rgba(255,255,255,0.9); font-family: monospace; margin-bottom: 8px; }
        
//         .task-status-overlay { 
//           position: absolute; 
//           inset: 0; 
//           background: #0f172a; 
//           border: 1px solid var(--accent); 
//           border-radius: 12px; 
//           padding: 12px; 
//           z-index: 10; 
//           display: flex; 
//           flex-direction: column; 
//           justify-content: center;
//           animation: popIn 0.2s ease-out;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.4);
//         }
//         .pop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
//         .pop-title { font-size: 9px; font-weight: bold; color: var(--accent); letter-spacing: 1px; }
//         .pop-close { background: none; border: none; color: white; cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 5px; opacity: 0.6; }
//         .pop-close:hover { opacity: 1; }
//         .task-status-btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
//         .task-status-option { font-size: 10px; padding: 6px 2px; border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.03); transition: 0.2s; border: 1px solid transparent; }
//         .task-status-option:hover { background: rgba(255,255,255,0.1); }

//         @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
//         .completion-badge, .remaining-badge {
//             margin-top: 8px;
//             padding: 6px;
//             border-radius: 6px;
//             text-align: center;
//         }
//         .completion-badge { background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; }
//         .remaining-badge { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); }
     
//      `}
//       </style>

//       <div className="console-container">
//         {!selectedCategory ? (
//           <div
//             className="summary-view"
//             style={{ animation: "fadeIn 0.5s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "25px",
//                 padding: "0 5px",
//               }}>
//               <h2 style={{ fontWeight: "400", letterSpacing: "0.5px" }}>
//                 Workflow <span style={{ color: "var(--accent)" }}>Console</span>
//               </h2>
//               <div style={{ display: "flex", gap: "15px" }}>
//                 <div className="burn-badge" style={{ fontSize: "11px" }}>
//                   SYSTEM LOAD: {totalLoad} NODES
//                 </div>
//                 {avgCycleTime && (
//                   <div className="time-badge" style={{ fontSize: "11px" }}>
//                     AV. CYCLE: {calculateDuration(0, avgCycleTime)}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="stat-grid-compact">
//               {stats.map((s) => (
//                 <div
//                   key={s.name}
//                   className="small-stat-card"
//                   onClick={() => setSelectedCategory(s.name)}>
//                   <div
//                     style={{
//                       color: s.color,
//                       fontSize: "15px",
//                       fontWeight: "bold",
//                     }}>
//                     {s.name.toUpperCase()}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "2.5rem",
//                       fontWeight: "bold",
//                       margin: "8px 0",
//                     }}>
//                     {s.value}
//                   </div>
//                   <div style={{ opacity: 0.4, fontSize: "9px" }}>
//                     TOTAL NODES
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="analytics-grid">
//               <div className="system-gauge-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     alignSelf: "flex-start",
//                     color: "var(--text-dim)",
//                     opacity: 0.6,
//                   }}>
//                   System capacity
//                 </h3>
//                 <div
//                   style={{
//                     height: "250px",
//                     width: "100%",
//                     position: "relative",
//                   }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={stats}
//                         startAngle={180}
//                         endAngle={0}
//                         innerRadius={90}
//                         outerRadius={125}
//                         paddingAngle={5}
//                         dataKey="value"
//                         stroke="none"
//                         animationBegin={0}
//                         animationDuration={600}
//                         isAnimationActive={true}>
//                         {stats.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <RechartsTooltip
//                         contentStyle={{
//                           background: "#020617",
//                           border: "none",
//                           borderRadius: "8px",
//                           fontSize: "12px",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "10px",
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       textAlign: "center",
//                     }}>
//                     <div style={{ fontSize: "28px", fontWeight: "bold" }}>
//                       {totalLoad}
//                     </div>
//                     <div style={{ fontSize: "10px", opacity: 0.5 }}>
//                       ACTIVE WIP
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="at-risk-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     marginBottom: "15px",
//                     color: "var(--danger)",
//                   }}>
//                   Nodes Requiring Attention ({attentionFeed.length})
//                 </h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "10px",
//                   }}>
//                   {attentionFeed.length === 0 && (
//                     <div
//                       style={{
//                         color: "var(--success)",
//                         textAlign: "center",
//                         marginTop: "50px",
//                         fontSize: "13px",
//                       }}>
//                       ✓ System Stable.
//                     </div>
//                   )}
//                   {attentionFeed.map((t) => (
//                     <div
//                       key={t._id}
//                       className="glass talent-item"
//                       style={{
//                         borderColor: "var(--danger)",
//                         background: "rgba(255, 71, 87, 0.05)",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "12px",
//                       }}>
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <span
//                           style={{
//                             color: "var(--danger)",
//                             fontSize: "8px",
//                             fontWeight: "bold",
//                           }}>
//                           DELAYED
//                         </span>
//                         <strong style={{ fontSize: "13px" }}>{t.title}</strong>
//                         <small style={{ fontSize: "10px" }}>
//                           In {t.status}
//                         </small>
//                       </div>
//                       <div
//                         className="time-badge"
//                         style={{
//                           color: "var(--danger)",
//                           background: "rgba(255, 71, 87, 0.1)",
//                           borderColor: "var(--danger)",
//                         }}>
//                         D:{" "}
//                         {new Date(t.deadline).toLocaleDateString([], {
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div
//             className="detail-view"
//             style={{ animation: "fadeIn 0.4s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "15px",
//                 marginBottom: "20px",
//               }}>
//               <button
//                 className="action-btn small"
//                 onClick={() => setSelectedCategory(null)}>
//                 ← BACK
//               </button>
//               <h3
//                 style={{
//                   color: columnConfig.find((c) => c.id === selectedCategory)
//                     .color,
//                 }}>
//                 {selectedCategory} PHASE
//               </h3>
//             </div>

//             <div className="compact-task-grid">
//               {tasks
//                 .filter((t) => t.status === selectedCategory)
//                 .map((t) => {
//                   const isActive = activePopover === t._id;
//                   const isOverdue =
//                     new Date(t.deadline) < now &&
//                     selectedCategory !== "Completed";
//                   const remainingText = getTimeRemaining(t.deadline);
//                   const col = columnConfig.find(
//                     (c) => c.id === selectedCategory,
//                   );

//                   return (
//                     <div key={t._id} style={{ position: "relative" }}>
//                       <div
//                         className="glass card compact-card"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActivePopover(isActive ? null : t._id);
//                         }}
//                         style={{
//                           borderLeft: `4px solid ${col.color}`,
//                           background: isActive
//                             ? "rgba(255,255,255,0.12)"
//                             : "rgba(255,255,255,0.04)",
//                           cursor: "pointer",
//                         }}>
//                         <div className="task-title">{t.title}</div>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "2px",
//                           }}>
//                           <div>
//                             <div className="timestamp-label">Assigned At</div>
//                             <div className="timestamp-value">
//                               {new Date(
//                                 t.assignedAt || t.createdAt,
//                               ).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="timestamp-label">Due Deadline</div>
//                             <div
//                               className="timestamp-value"
//                               style={{
//                                 color: isOverdue ? "var(--danger)" : "inherit",
//                               }}>
//                               {new Date(t.deadline).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                         </div>

//                         {/* STATUS SPECIFIC FOOTER */}
//                         {t.status === "Completed" && t.completedAt ? (
//                           <div className="completion-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "#2ecc71" }}>
//                               Total Workflow Time
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "bold",
//                                 color: "white",
//                               }}>
//                               {calculateDuration(
//                                 t.assignedAt || t.createdAt,
//                                 t.completedAt,
//                               )}
//                             </div>
//                           </div>
//                         ) : isOverdue ? (
//                           <div
//                             style={{
//                               marginTop: "10px",
//                               color: "#ff4757",
//                               fontSize: "8px",
//                               fontWeight: "bold",
//                               textAlign: "center",
//                               letterSpacing: "1px",
//                             }}>
//                             ⚠️ CRITICAL DELAY
//                           </div>
//                         ) : (
//                           <div className="remaining-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "var(--accent)" }}>
//                               Time Remaining
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "600",
//                                 color: "white",
//                               }}>
//                               {remainingText || "Calculating..."}
//                             </div>
//                           </div>
//                         )}

//                         {isActive && (
//                           <div
//                             className="task-status-overlay"
//                             onClick={(e) => e.stopPropagation()}>
//                             <div className="pop-header">
//                               <span className="pop-title">SET PHASE</span>
//                               <button
//                                 className="pop-close"
//                                 onClick={() => setActivePopover(null)}>
//                                 &times;
//                               </button>
//                             </div>
//                             <div className="task-status-btn-grid">
//                               {columnConfig.map((btn) => (
//                                 <button
//                                   key={btn.id}
//                                   className="task-status-option"
//                                   onClick={(e) =>
//                                     updateStatus(t._id, btn.id, e)
//                                   }
//                                   style={{
//                                     borderColor:
//                                       btn.id === t.status
//                                         ? btn.color
//                                         : btn.color + "44",
//                                     color: btn.color,
//                                   }}>
//                                   {btn.id}
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// function TaskCenter({ token, showToast }) {
//   const [tasks, setTasks] = useState([]);
//   const [activePopover, setActivePopover] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [now, setNow] = useState(new Date());

//   // Filter States
//   const [filterDate, setFilterDate] = useState("");
//   const [filterMode, setFilterMode] = useState("assignedAt"); // 'assignedAt' or 'deadline'

//   useEffect(() => {
//     const timer = setInterval(() => setNow(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allTasks = res.data.performance?.assignedTasks || [];
//       const currentTime = new Date();
//       const processedTasks = allTasks.map((t) => ({
//         ...t,
//         isAtRisk:
//           (t.status === "Pending" ||
//             t.status === "Planning" ||
//             t.status === "Processing") &&
//           new Date(t.deadline) < currentTime,
//       }));
//       setTasks(processedTasks);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [token]);

//   useEffect(() => {
//     const handleGlobalClick = () => setActivePopover(null);
//     if (activePopover) window.addEventListener("click", handleGlobalClick);
//     return () => window.removeEventListener("click", handleGlobalClick);
//   }, [activePopover]);

//   const updateStatus = async (taskId, newStatus, e) => {
//     if (e) e.stopPropagation();
//     try {
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
//       );
//       setActivePopover(null);
//       await axios.patch(
//         `${API_URL}/employee/update-task-status/${taskId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast(`Moved to ${newStatus}`, "success");
//     } catch (e) {
//       showToast("Sync failed", "error");
//       fetchTasks();
//     }
//   };

//   const calculateDuration = (start, end) => {
//     const s = new Date(start);
//     const e = new Date(end);
//     const diffMs = Math.abs(e - s);
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${minutes}m`;
//   };

//   const getTimeRemaining = (deadline) => {
//     const diff = new Date(deadline) - now;
//     if (diff <= 0) return null;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const mins = Math.floor((diff / 1000 / 60) % 60);
//     if (days > 0) return `${days}d ${hours}h remaining`;
//     if (hours > 0) return `${hours}h ${mins}m remaining`;
//     return `${mins}m remaining`;
//   };

//   const columnConfig = [
//     { id: "Pending", color: "#f1c40f" },
//     { id: "Planning", color: "#a29bfe" },
//     { id: "Processing", color: "#3498db" },
//     { id: "Completed", color: "#2ecc71" },
//   ];

//   const stats = useMemo(() => {
//     return columnConfig.map((col) => ({
//       name: col.id,
//       value: tasks.filter((t) => t.status === col.id).length,
//       color: col.color,
//     }));
//   }, [tasks]);

//   const attentionFeed = useMemo(() => {
//     return tasks.filter((t) => t.isAtRisk).slice(0, 4);
//   }, [tasks]);

//   const totalLoad = stats.reduce((sum, s) => sum + s.value, 0);
//   const completedTasks = tasks.filter(
//     (t) => t.status === "Completed" && t.completedAt,
//   );
//   const avgCycleTime =
//     completedTasks.length > 0
//       ? completedTasks.reduce(
//           (sum, t) =>
//             sum +
//             Math.abs(
//               new Date(t.completedAt) - new Date(t.assignedAt || t.createdAt),
//             ),
//           0,
//         ) / completedTasks.length
//       : null;

//   // Filter Logic: Filtered tasks for the detailed view
//   const filteredTasks = useMemo(() => {
//     let result = tasks.filter((t) => t.status === selectedCategory);
    
//     if (filterDate) {
//       result = result.filter((t) => {
//         // Get the date object based on mode
//         const dateObj = new Date(
//           filterMode === "assignedAt"
//             ? t.assignedAt || t.createdAt
//             : t.deadline,
//         );

//         // Extract Local Year, Month, and Day
//         const year = dateObj.getFullYear();
//         const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//         const day = String(dateObj.getDate()).padStart(2, "0");

//         // Construct YYYY-MM-DD string from local time
//         const localDateString = `${year}-${month}-${day}`;

//         return localDateString === filterDate;
//       });
//     }
//     return result;
//   }, [tasks, selectedCategory, filterDate, filterMode]);


//   return (
//     <section className="page-content" style={{ padding: 0 }}>
//       <style>
//         {`
//         .console-container { padding: 20px; color: white; height: calc(100vh - 140px); overflow-y: auto; overflow-x: visible; }
//         .analytics-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; margin-bottom: 30px; }
//         .system-gauge-pane { background: var(--glass); border-radius: 20px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative; min-height: 240px; }
//         .at-risk-pane { background: rgba(0,0,0,0.2); border-radius: 20px; padding: 30px; }
//         .stat-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
//         .small-stat-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 15px; border-radius: 14px; text-align: center; cursor: pointer; transition: 0.2s; }
//         .small-stat-card:hover { background: var(--accent-soft); border-color: var(--accent); transform: translateY(-3px); }
//         .compact-task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
//         .compact-card { padding: 16px !important; border-radius: 12px !important; position: relative; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between; }
//         .task-title { font-size: 0.9rem; font-weight: 600; color: white; margin-bottom: 12px; }
//         .timestamp-label { font-size: 8px; text-transform: uppercase; color: var(--text-dim); }
//         .timestamp-value { font-size: 11px; color: rgba(255,255,255,0.9); font-family: monospace; margin-bottom: 8px; }
//         .task-status-overlay { position: absolute; inset: 0; background: #0f172a; border: 1px solid var(--accent); border-radius: 12px; padding: 12px; z-index: 10; display: flex; flex-direction: column; justify-content: center; animation: popIn 0.2s ease-out; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
//         .pop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
//         .pop-title { font-size: 9px; font-weight: bold; color: var(--accent); letter-spacing: 1px; }
//         .pop-close { background: none; border: none; color: white; cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 5px; opacity: 0.6; }
//         .pop-close:hover { opacity: 1; }
//         .task-status-btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
//         .task-status-option { font-size: 10px; padding: 6px 2px; border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.03); transition: 0.2s; border: 1px solid transparent; }
//         .task-status-option:hover { background: rgba(255,255,255,0.1); }
//         .filter-bar { background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid var(--glass-border); }
//         .filter-group { display: flex; align-items: center; gap: 10px; }
//         .filter-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
//         .filter-input { background: #0f172a; border: 1px solid var(--glass-border); color: white; padding: 5px 10px; border-radius: 6px; font-size: 12px; outline: none; }
//         .filter-toggle { display: flex; background: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border); }
//         .toggle-btn { padding: 6px 12px; font-size: 10px; border: none; background: transparent; color: var(--text-dim); cursor: pointer; transition: 0.2s; }
//         .toggle-btn.active { background: var(--accent); color: white; }
//         @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .completion-badge, .remaining-badge { margin-top: 8px; padding: 6px; border-radius: 6px; text-align: center; }
//         .completion-badge { background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; }
//         .remaining-badge { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); }
//       `}
//       </style>

//       <div className="console-container">
//         {!selectedCategory ? (
//           <div
//             className="summary-view"
//             style={{ animation: "fadeIn 0.5s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "25px",
//                 padding: "0 5px",
//               }}>
//               <h2 style={{ fontWeight: "400", letterSpacing: "0.5px" }}>
//                 Workflow <span style={{ color: "var(--accent)" }}>Console</span>
//               </h2>
//               <div style={{ display: "flex", gap: "15px" }}>
//                 <div className="burn-badge" style={{ fontSize: "11px" }}>
//                   SYSTEM LOAD: {totalLoad} NODES
//                 </div>
//                 {avgCycleTime && (
//                   <div className="time-badge" style={{ fontSize: "11px" }}>
//                     AV. CYCLE: {calculateDuration(0, avgCycleTime)}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="stat-grid-compact">
//               {stats.map((s) => (
//                 <div
//                   key={s.name}
//                   className="small-stat-card"
//                   onClick={() => setSelectedCategory(s.name)}>
//                   <div
//                     style={{
//                       color: s.color,
//                       fontSize: "15px",
//                       fontWeight: "bold",
//                     }}>
//                     {s.name.toUpperCase()}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "2.5rem",
//                       fontWeight: "bold",
//                       margin: "8px 0",
//                     }}>
//                     {s.value}
//                   </div>
//                   <div style={{ opacity: 0.4, fontSize: "9px" }}>
//                     TOTAL NODES
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="analytics-grid">
//               <div className="system-gauge-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     alignSelf: "flex-start",
//                     color: "var(--text-dim)",
//                     opacity: 0.6,
//                   }}>
//                   System capacity
//                 </h3>
//                 <div
//                   style={{
//                     height: "250px",
//                     width: "100%",
//                     position: "relative",
//                   }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={stats}
//                         startAngle={180}
//                         endAngle={0}
//                         innerRadius={90}
//                         outerRadius={125}
//                         paddingAngle={5}
//                         dataKey="value"
//                         stroke="none"
//                         animationBegin={0}
//                         animationDuration={600}
//                         isAnimationActive={true}>
//                         {stats.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <RechartsTooltip
//                         contentStyle={{
//                           background: "#020617",
//                           border: "none",
//                           borderRadius: "8px",
//                           fontSize: "12px",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "10px",
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       textAlign: "center",
//                     }}>
//                     <div style={{ fontSize: "28px", fontWeight: "bold" }}>
//                       {totalLoad}
//                     </div>
//                     <div style={{ fontSize: "10px", opacity: 0.5 }}>
//                       ACTIVE WIP
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="at-risk-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     marginBottom: "15px",
//                     color: "var(--danger)",
//                   }}>
//                   Nodes Requiring Attention ({attentionFeed.length})
//                 </h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "10px",
//                   }}>
//                   {attentionFeed.length === 0 && (
//                     <div
//                       style={{
//                         color: "var(--success)",
//                         textAlign: "center",
//                         marginTop: "50px",
//                         fontSize: "13px",
//                       }}>
//                       ✓ System Stable.
//                     </div>
//                   )}
//                   {attentionFeed.map((t) => (
//                     <div
//                       key={t._id}
//                       className="glass talent-item"
//                       style={{
//                         borderColor: "var(--danger)",
//                         background: "rgba(255, 71, 87, 0.05)",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "12px",
//                       }}>
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <span
//                           style={{
//                             color: "var(--danger)",
//                             fontSize: "8px",
//                             fontWeight: "bold",
//                           }}>
//                           DELAYED
//                         </span>
//                         <strong style={{ fontSize: "13px" }}>{t.title}</strong>
//                         <small style={{ fontSize: "10px" }}>
//                           In {t.status}
//                         </small>
//                       </div>
//                       <div
//                         className="time-badge"
//                         style={{
//                           color: "var(--danger)",
//                           background: "rgba(255, 71, 87, 0.1)",
//                           borderColor: "var(--danger)",
//                         }}>
//                         D:{" "}
//                         {new Date(t.deadline).toLocaleDateString([], {
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div
//             className="detail-view"
//             style={{ animation: "fadeIn 0.4s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "20px",
//               }}>
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <button
//                   className="action-btn small"
//                   onClick={() => {
//                     setSelectedCategory(null);
//                     setFilterDate(""); // Reset filter on back
//                   }}>
//                   ← BACK
//                 </button>
//                 <h3
//                   style={{
//                     color: columnConfig.find((c) => c.id === selectedCategory)
//                       .color,
//                   }}>
//                   {selectedCategory} PHASE
//                 </h3>
//               </div>

//               {/* Filter Logic UI */}
//               <div className="filter-bar">
//                 <div className="filter-group">
//                   <span className="filter-label">Filter by:</span>
//                   <div className="filter-toggle">
//                     <button
//                       className={`toggle-btn ${filterMode === "assignedAt" ? "active" : ""}`}
//                       onClick={() => setFilterMode("assignedAt")}>
//                       Assigned
//                     </button>
//                     <button
//                       className={`toggle-btn ${filterMode === "deadline" ? "active" : ""}`}
//                       onClick={() => setFilterMode("deadline")}>
//                       Due Date
//                     </button>
//                   </div>
//                 </div>
//                 <div className="filter-group">
//                   <input
//                     type="date"
//                     className="filter-input"
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                   />
//                   {filterDate && (
//                     <button
//                       style={{
//                         background: "none",
//                         border: "none",
//                         color: "var(--danger)",
//                         cursor: "pointer",
//                         fontSize: "10px",
//                       }}
//                       onClick={() => setFilterDate("")}>
//                       CLEAR
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {filteredTasks.length === 0 ? (
//               <div
//                 style={{ textAlign: "center", padding: "40px", opacity: 0.5 }}>
//                 No tasks match the selected criteria.
//               </div>
//             ) : (
//               <div className="compact-task-grid">
//                 {filteredTasks.map((t) => {
//                   const isActive = activePopover === t._id;
//                   const isOverdue =
//                     new Date(t.deadline) < now &&
//                     selectedCategory !== "Completed";
//                   const remainingText = getTimeRemaining(t.deadline);
//                   const col = columnConfig.find(
//                     (c) => c.id === selectedCategory,
//                   );

//                   return (
//                     <div key={t._id} style={{ position: "relative" }}>
//                       <div
//                         className="glass card compact-card"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActivePopover(isActive ? null : t._id);
//                         }}
//                         style={{
//                           borderLeft: `4px solid ${col.color}`,
//                           background: isActive
//                             ? "rgba(255,255,255,0.12)"
//                             : "rgba(255,255,255,0.04)",
//                           cursor: "pointer",
//                         }}>
//                         <div className="task-title">{t.title}</div>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "2px",
//                           }}>
//                           <div>
//                             <div className="timestamp-label">Assigned At</div>
//                             <div className="timestamp-value">
//                               {new Date(
//                                 t.assignedAt || t.createdAt,
//                               ).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="timestamp-label">Due Deadline</div>
//                             <div
//                               className="timestamp-value"
//                               style={{
//                                 color: isOverdue ? "var(--danger)" : "inherit",
//                               }}>
//                               {new Date(t.deadline).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                         </div>

//                         {t.status === "Completed" && t.completedAt ? (
//                           <div className="completion-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "#2ecc71" }}>
//                               Total Workflow Time
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "bold",
//                                 color: "white",
//                               }}>
//                               {calculateDuration(
//                                 t.assignedAt || t.createdAt,
//                                 t.completedAt,
//                               )}
//                             </div>
//                           </div>
//                         ) : isOverdue ? (
//                           <div
//                             style={{
//                               marginTop: "10px",
//                               color: "#ff4757",
//                               fontSize: "8px",
//                               fontWeight: "bold",
//                               textAlign: "center",
//                               letterSpacing: "1px",
//                             }}>
//                             ⚠️ CRITICAL DELAY
//                           </div>
//                         ) : (
//                           <div className="remaining-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "var(--accent)" }}>
//                               Time Remaining
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "600",
//                                 color: "white",
//                               }}>
//                               {remainingText || "Calculating..."}
//                             </div>
//                           </div>
//                         )}

//                         {isActive && (
//                           <div
//                             className="task-status-overlay"
//                             onClick={(e) => e.stopPropagation()}>
//                             <div className="pop-header">
//                               <span className="pop-title">SET PHASE</span>
//                               <button
//                                 className="pop-close"
//                                 onClick={() => setActivePopover(null)}>
//                                 &times;
//                               </button>
//                             </div>
//                             <div className="task-status-btn-grid">
//                               {columnConfig.map((btn) => (
//                                 <button
//                                   key={btn.id}
//                                   className="task-status-option"
//                                   onClick={(e) =>
//                                     updateStatus(t._id, btn.id, e)
//                                   }
//                                   style={{
//                                     borderColor:
//                                       btn.id === t.status
//                                         ? btn.color
//                                         : btn.color + "44",
//                                     color: btn.color,
//                                   }}>
//                                   {btn.id}
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// function TaskCenter({ token, showToast }) {
//   const [tasks, setTasks] = useState([]);
//   const [activePopover, setActivePopover] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [now, setNow] = useState(new Date());

//   // Filter States
//   const [filterDate, setFilterDate] = useState("");
//   const [filterMode, setFilterMode] = useState("assignedAt"); // 'assignedAt' or 'deadline'

//   useEffect(() => {
//     const timer = setInterval(() => setNow(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allTasks = res.data.performance?.assignedTasks || [];
//       const currentTime = new Date();
//       const processedTasks = allTasks.map((t) => ({
//         ...t,
//         isAtRisk:
//           (t.status === "Pending" ||
//             t.status === "Planning" ||
//             t.status === "Processing") &&
//           new Date(t.deadline) < currentTime,
//       }));
//       setTasks(processedTasks);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [token]);

//   useEffect(() => {
//     const handleGlobalClick = () => setActivePopover(null);
//     if (activePopover) window.addEventListener("click", handleGlobalClick);
//     return () => window.removeEventListener("click", handleGlobalClick);
//   }, [activePopover]);

//   const updateStatus = async (taskId, newStatus, e) => {
//     if (e) e.stopPropagation();
//     try {
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
//       );
//       setActivePopover(null);
//       await axios.patch(
//         `${API_URL}/employee/update-task-status/${taskId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast(`Moved to ${newStatus}`, "success");
//     } catch (e) {
//       showToast("Sync failed", "error");
//       fetchTasks();
//     }
//   };

//   const calculateDuration = (start, end) => {
//     const s = new Date(start);
//     const e = new Date(end);
//     const diffMs = Math.abs(e - s);
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${minutes}m`;
//   };

//   const getTimeRemaining = (deadline) => {
//     const diff = new Date(deadline) - now;
//     if (diff <= 0) return null;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const mins = Math.floor((diff / 1000 / 60) % 60);
//     if (days > 0) return `${days}d ${hours}h remaining`;
//     if (hours > 0) return `${hours}h ${mins}m remaining`;
//     return `${mins}m remaining`;
//   };

//   const columnConfig = [
//     { id: "Pending", color: "#f1c40f" },
//     { id: "Planning", color: "#a29bfe" },
//     { id: "Processing", color: "#3498db" },
//     { id: "Completed", color: "#2ecc71" },
//   ];

//   const stats = useMemo(() => {
//     return columnConfig.map((col) => ({
//       name: col.id,
//       value: tasks.filter((t) => t.status === col.id).length,
//       color: col.color,
//     }));
//   }, [tasks]);

//   const attentionFeed = useMemo(() => {
//     return tasks.filter((t) => t.isAtRisk).slice(0, 4);
//   }, [tasks]);

//   const totalLoad = stats.reduce((sum, s) => sum + s.value, 0);
//   const completedTasks = tasks.filter(
//     (t) => t.status === "Completed" && t.completedAt,
//   );
//   const avgCycleTime =
//     completedTasks.length > 0
//       ? completedTasks.reduce(
//           (sum, t) =>
//             sum +
//             Math.abs(
//               new Date(t.completedAt) - new Date(t.assignedAt || t.createdAt),
//             ),
//           0,
//         ) / completedTasks.length
//       : null;

//   const filteredTasks = useMemo(() => {
//     let result = tasks.filter((t) => t.status === selectedCategory);

//     if (filterDate) {
//       result = result.filter((t) => {
//         const dateObj = new Date(
//           filterMode === "assignedAt"
//             ? t.assignedAt || t.createdAt
//             : t.deadline,
//         );
//         const year = dateObj.getFullYear();
//         const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//         const day = String(dateObj.getDate()).padStart(2, "0");
//         const localDateString = `${year}-${month}-${day}`;
//         return localDateString === filterDate;
//       });
//     }
//     return result;
//   }, [tasks, selectedCategory, filterDate, filterMode]);

//   return (
//     <section 
//       className="page-content" 
//       style={{ 
//         padding: 0, 
//         height: "calc(100vh - 120px)", // Matches Dashboard layout
//         overflow: "hidden"             // Prevents the section-level scrollbar
//       }}
//     >
//       <style>
//         {`
//           .console-container { 
//             padding: 20px; 
//             color: white; 
//             height: 100%;             /* Takes full height of the section */
//             overflow-y: auto; 
//             overflow-x: hidden; 
//             box-sizing: border-box;
//           }
//           .analytics-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; margin-bottom: 30px; }
//           .system-gauge-pane { background: var(--glass); border-radius: 20px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative; min-height: 240px; }
//           .at-risk-pane { background: rgba(0,0,0,0.2); border-radius: 20px; padding: 30px; }
//           .stat-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
//           .small-stat-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 15px; border-radius: 14px; text-align: center; cursor: pointer; transition: 0.2s; }
//           .small-stat-card:hover { background: var(--accent-soft); border-color: var(--accent); transform: translateY(-3px); }
//           .compact-task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; padding-bottom: 40px; }
//           .compact-card { padding: 16px !important; border-radius: 12px !important; position: relative; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between; }
//           .task-title { font-size: 0.9rem; font-weight: 600; color: white; margin-bottom: 12px; }
//           .timestamp-label { font-size: 8px; text-transform: uppercase; color: var(--text-dim); }
//           .timestamp-value { font-size: 11px; color: rgba(255,255,255,0.9); font-family: monospace; margin-bottom: 8px; }
//           .task-status-overlay { position: absolute; inset: 0; background: #0f172a; border: 1px solid var(--accent); border-radius: 12px; padding: 12px; z-index: 10; display: flex; flex-direction: column; justify-content: center; animation: popIn 0.2s ease-out; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
//           .pop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
//           .pop-title { font-size: 9px; font-weight: bold; color: var(--accent); letter-spacing: 1px; }
//           .pop-close { background: none; border: none; color: white; cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 5px; opacity: 0.6; }
//           .pop-close:hover { opacity: 1; }
//           .task-status-btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
//           .task-status-option { font-size: 10px; padding: 6px 2px; border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.03); transition: 0.2s; border: 1px solid transparent; }
//           .task-status-option:hover { background: rgba(255,255,255,0.1); }
//           .filter-bar { background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid var(--glass-border); }
//           .filter-group { display: flex; align-items: center; gap: 10px; }
//           .filter-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
//           .filter-input { background: #0f172a; border: 1px solid var(--glass-border); color: white; padding: 5px 10px; border-radius: 6px; font-size: 12px; outline: none; }
//           .filter-toggle { display: flex; background: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border); }
//           .toggle-btn { padding: 6px 12px; font-size: 10px; border: none; background: transparent; color: var(--text-dim); cursor: pointer; transition: 0.2s; }
//           .toggle-btn.active { background: var(--accent); color: white; }
          
//           /* Custom Scrollbar for the console */
//           .console-container::-webkit-scrollbar { width: 6px; }
//           .console-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          
//           @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//           @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//           .completion-badge, .remaining-badge { margin-top: 8px; padding: 6px; border-radius: 6px; text-align: center; }
//           .completion-badge { background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; }
//           .remaining-badge { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); }
//         `}
//       </style>

//       <div className="console-container">
//         {!selectedCategory ? (
//           <div
//             className="summary-view"
//             style={{ animation: "fadeIn 0.5s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "25px",
//                 padding: "0 5px",
//               }}>
//               <h2 style={{ fontWeight: "400", letterSpacing: "0.5px", margin: 0 }}>
//                 Workflow <span style={{ color: "var(--accent)" }}>Console</span>
//               </h2>
//               <div style={{ display: "flex", gap: "15px" }}>
//                 <div className="burn-badge" style={{ fontSize: "11px" }}>
//                   SYSTEM LOAD: {totalLoad} NODES
//                 </div>
//                 {avgCycleTime && (
//                   <div className="time-badge" style={{ fontSize: "11px" }}>
//                     AV. CYCLE: {calculateDuration(0, avgCycleTime)}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="stat-grid-compact">
//               {stats.map((s) => (
//                 <div
//                   key={s.name}
//                   className="small-stat-card"
//                   onClick={() => setSelectedCategory(s.name)}>
//                   <div
//                     style={{
//                       color: s.color,
//                       fontSize: "15px",
//                       fontWeight: "bold",
//                     }}>
//                     {s.name.toUpperCase()}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "2.5rem",
//                       fontWeight: "bold",
//                       margin: "8px 0",
//                     }}>
//                     {s.value}
//                   </div>
//                   <div style={{ opacity: 0.4, fontSize: "9px" }}>
//                     TOTAL NODES
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="analytics-grid">
//               <div className="system-gauge-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     alignSelf: "flex-start",
//                     color: "var(--text-dim)",
//                     opacity: 0.6,
//                     margin: 0
//                   }}>
//                   System capacity
//                 </h3>
//                 <div
//                   style={{
//                     height: "250px",
//                     width: "100%",
//                     position: "relative",
//                   }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={stats}
//                         startAngle={180}
//                         endAngle={0}
//                         innerRadius={90}
//                         outerRadius={125}
//                         paddingAngle={5}
//                         dataKey="value"
//                         stroke="none"
//                         animationBegin={0}
//                         animationDuration={600}
//                         isAnimationActive={true}>
//                         {stats.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <RechartsTooltip
//                         contentStyle={{
//                           background: "#020617",
//                           border: "none",
//                           borderRadius: "8px",
//                           fontSize: "12px",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "10px",
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       textAlign: "center",
//                     }}>
//                     <div style={{ fontSize: "28px", fontWeight: "bold" }}>
//                       {totalLoad}
//                     </div>
//                     <div style={{ fontSize: "10px", opacity: 0.5 }}>
//                       ACTIVE WIP
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="at-risk-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     marginBottom: "15px",
//                     marginTop: 0,
//                     color: "var(--danger)",
//                   }}>
//                   Nodes Requiring Attention ({attentionFeed.length})
//                 </h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "10px",
//                   }}>
//                   {attentionFeed.length === 0 && (
//                     <div
//                       style={{
//                         color: "var(--success)",
//                         textAlign: "center",
//                         padding: "50px 0",
//                         fontSize: "13px",
//                       }}>
//                       ✓ System Stable.
//                     </div>
//                   )}
//                   {attentionFeed.map((t) => (
//                     <div
//                       key={t._id}
//                       className="glass talent-item"
//                       style={{
//                         borderColor: "var(--danger)",
//                         background: "rgba(255, 71, 87, 0.05)",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "12px",
//                       }}>
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <span
//                           style={{
//                             color: "var(--danger)",
//                             fontSize: "8px",
//                             fontWeight: "bold",
//                           }}>
//                           DELAYED
//                         </span>
//                         <strong style={{ fontSize: "13px" }}>{t.title}</strong>
//                         <small style={{ fontSize: "10px" }}>
//                           In {t.status}
//                         </small>
//                       </div>
//                       <div
//                         className="time-badge"
//                         style={{
//                           color: "var(--danger)",
//                           background: "rgba(255, 71, 87, 0.1)",
//                           borderColor: "var(--danger)",
//                         }}>
//                         D:{" "}
//                         {new Date(t.deadline).toLocaleDateString([], {
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div
//             className="detail-view"
//             style={{ animation: "fadeIn 0.4s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "20px",
//               }}>
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <button
//                   className="action-btn small"
//                   onClick={() => {
//                     setSelectedCategory(null);
//                     setFilterDate(""); // Reset filter on back
//                   }}>
//                   ← BACK
//                 </button>
//                 <h3
//                   style={{
//                     margin: 0,
//                     color: columnConfig.find((c) => c.id === selectedCategory)
//                       .color,
//                   }}>
//                   {selectedCategory} PHASE
//                 </h3>
//               </div>

//               <div className="filter-bar" style={{ margin: 0 }}>
//                 <div className="filter-group">
//                   <span className="filter-label">Filter:</span>
//                   <div className="filter-toggle">
//                     <button
//                       className={`toggle-btn ${filterMode === "assignedAt" ? "active" : ""}`}
//                       onClick={() => setFilterMode("assignedAt")}>
//                       Assigned
//                     </button>
//                     <button
//                       className={`toggle-btn ${filterMode === "deadline" ? "active" : ""}`}
//                       onClick={() => setFilterMode("deadline")}>
//                       Due
//                     </button>
//                   </div>
//                 </div>
//                 <div className="filter-group">
//                   <input
//                     type="date"
//                     className="filter-input"
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                   />
//                   {filterDate && (
//                     <button
//                       style={{
//                         background: "none",
//                         border: "none",
//                         color: "var(--danger)",
//                         cursor: "pointer",
//                         fontSize: "10px",
//                       }}
//                       onClick={() => setFilterDate("")}>
//                       CLEAR
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {filteredTasks.length === 0 ? (
//               <div
//                 style={{ textAlign: "center", padding: "100px 40px", opacity: 0.5 }}>
//                 No tasks match the selected criteria.
//               </div>
//             ) : (
//               <div className="compact-task-grid">
//                 {filteredTasks.map((t) => {
//                   const isActive = activePopover === t._id;
//                   const isOverdue =
//                     new Date(t.deadline) < now &&
//                     selectedCategory !== "Completed";
//                   const remainingText = getTimeRemaining(t.deadline);
//                   const col = columnConfig.find(
//                     (c) => c.id === selectedCategory,
//                   );

//                   return (
//                     <div key={t._id} style={{ position: "relative" }}>
//                       <div
//                         className="glass card compact-card"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActivePopover(isActive ? null : t._id);
//                         }}
//                         style={{
//                           borderLeft: `4px solid ${col.color}`,
//                           background: isActive
//                             ? "rgba(255,255,255,0.12)"
//                             : "rgba(255,255,255,0.04)",
//                           cursor: "pointer",
//                         }}>
//                         <div className="task-title">{t.title}</div>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "2px",
//                           }}>
//                           <div>
//                             <div className="timestamp-label">Assigned At</div>
//                             <div className="timestamp-value">
//                               {new Date(
//                                 t.assignedAt || t.createdAt,
//                               ).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="timestamp-label">Due Deadline</div>
//                             <div
//                               className="timestamp-value"
//                               style={{
//                                 color: isOverdue ? "var(--danger)" : "inherit",
//                               }}>
//                               {new Date(t.deadline).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                         </div>

//                         {t.status === "Completed" && t.completedAt ? (
//                           <div className="completion-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "#2ecc71" }}>
//                               Total Workflow Time
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "bold",
//                                 color: "white",
//                               }}>
//                               {calculateDuration(
//                                 t.assignedAt || t.createdAt,
//                                 t.completedAt,
//                               )}
//                             </div>
//                           </div>
//                         ) : isOverdue ? (
//                           <div
//                             style={{
//                               marginTop: "10px",
//                               color: "#ff4757",
//                               fontSize: "8px",
//                               fontWeight: "bold",
//                               textAlign: "center",
//                               letterSpacing: "1px",
//                             }}>
//                             ⚠️ CRITICAL DELAY
//                           </div>
//                         ) : (
//                           <div className="remaining-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "var(--accent)" }}>
//                               Time Remaining
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "600",
//                                 color: "white",
//                               }}>
//                               {remainingText || "Calculating..."}
//                             </div>
//                           </div>
//                         )}

//                         {isActive && (
//                           <div
//                             className="task-status-overlay"
//                             onClick={(e) => e.stopPropagation()}>
//                             <div className="pop-header">
//                               <span className="pop-title">SET PHASE</span>
//                               <button
//                                 className="pop-close"
//                                 onClick={() => setActivePopover(null)}>
//                                 &times;
//                               </button>
//                             </div>
//                             <div className="task-status-btn-grid">
//                               {columnConfig.map((btn) => (
//                                 <button
//                                   key={btn.id}
//                                   className="task-status-option"
//                                   onClick={(e) =>
//                                     updateStatus(t._id, btn.id, e)
//                                   }
//                                   style={{
//                                     borderColor:
//                                       btn.id === t.status
//                                         ? btn.color
//                                         : btn.color + "44",
//                                     color: btn.color,
//                                   }}>
//                                   {btn.id}
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// function TaskCenter({ token, showToast }) {
//   const [tasks, setTasks] = useState([]);
//   const [activePopover, setActivePopover] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [now, setNow] = useState(new Date());

//   // Filter States
//   const [filterDate, setFilterDate] = useState("");
//   const [filterMode, setFilterMode] = useState("assignedAt"); // 'assignedAt' or 'deadline'

//   useEffect(() => {
//     const timer = setInterval(() => setNow(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allTasks = res.data.performance?.assignedTasks || [];
//       const currentTime = new Date();
//       const processedTasks = allTasks.map((t) => ({
//         ...t,
//         isAtRisk:
//           (t.status === "Pending" ||
//             t.status === "Planning" ||
//             t.status === "Processing") &&
//           new Date(t.deadline) < currentTime,
//       }));
//       setTasks(processedTasks);
//     } catch (e) {
//       console.error("Fetch Error:", e);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [token]);

//   useEffect(() => {
//     const handleGlobalClick = () => setActivePopover(null);
//     if (activePopover) window.addEventListener("click", handleGlobalClick);
//     return () => window.removeEventListener("click", handleGlobalClick);
//   }, [activePopover]);

//   const updateStatus = async (taskId, newStatus, e) => {
//     if (e) e.stopPropagation();
//     try {
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
//       );
//       setActivePopover(null);
//       await axios.patch(
//         `${API_URL}/employee/update-task-status/${taskId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast(`Moved to ${newStatus}`, "success");
//     } catch (e) {
//       showToast("Sync failed", "error");
//       fetchTasks();
//     }
//   };

//   const calculateDuration = (start, end) => {
//     const s = new Date(start);
//     const e = new Date(end);
//     const diffMs = Math.abs(e - s);
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${minutes}m`;
//   };

//   const getTimeRemaining = (deadline) => {
//     const diff = new Date(deadline) - now;
//     if (diff <= 0) return null;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const mins = Math.floor((diff / 1000 / 60) % 60);
//     if (days > 0) return `${days}d ${hours}h remaining`;
//     if (hours > 0) return `${hours}h ${mins}m remaining`;
//     return `${mins}m remaining`;
//   };

//   const columnConfig = [
//     { id: "Pending", color: "#f1c40f" },
//     { id: "Planning", color: "#a29bfe" },
//     { id: "Processing", color: "#3498db" },
//     { id: "Completed", color: "#2ecc71" },
//   ];

//   const stats = useMemo(() => {
//     return columnConfig.map((col) => ({
//       name: col.id,
//       value: tasks.filter((t) => t.status === col.id).length,
//       color: col.color,
//     }));
//   }, [tasks]);

//   const attentionFeed = useMemo(() => {
//     return tasks.filter((t) => t.isAtRisk).slice(0, 4);
//   }, [tasks]);

//   const totalLoad = stats.reduce((sum, s) => sum + s.value, 0);
//   const completedTasks = tasks.filter(
//     (t) => t.status === "Completed" && t.completedAt,
//   );
//   const avgCycleTime =
//     completedTasks.length > 0
//       ? completedTasks.reduce(
//           (sum, t) =>
//             sum +
//             Math.abs(
//               new Date(t.completedAt) - new Date(t.assignedAt || t.createdAt),
//             ),
//           0,
//         ) / completedTasks.length
//       : null;

//   const filteredTasks = useMemo(() => {
//     let result = tasks.filter((t) => t.status === selectedCategory);

//     if (filterDate) {
//       result = result.filter((t) => {
//         const dateObj = new Date(
//           filterMode === "assignedAt"
//             ? t.assignedAt || t.createdAt
//             : t.deadline,
//         );
//         const year = dateObj.getFullYear();
//         const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//         const day = String(dateObj.getDate()).padStart(2, "0");
//         const localDateString = `${year}-${month}-${day}`;
//         return localDateString === filterDate;
//       });
//     }
//     return result;
//   }, [tasks, selectedCategory, filterDate, filterMode]);

//   return (
//     <section
//       className="page-content"
//       style={{
//         padding: 0,
//         height: "calc(100vh - 120px)",
//         overflow: "hidden",
//       }}>
//       <style>
//         {`
//           .console-container { 
//             padding: 20px; 
//             color: white; 
//             height: 100%; 
//             overflow: hidden; /* Changed from auto to hidden to remove scrollbar */
//             box-sizing: border-box;
//           }
//           .analytics-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; margin-bottom: 30px; }
//           .system-gauge-pane { background: var(--glass); border-radius: 20px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative; min-height: 240px; }
//           .at-risk-pane { background: rgba(0,0,0,0.2); border-radius: 20px; padding: 30px; }
//           .stat-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
//           .small-stat-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 15px; border-radius: 14px; text-align: center; cursor: pointer; transition: 0.2s; }
//           .small-stat-card:hover { background: var(--accent-soft); border-color: var(--accent); transform: translateY(-3px); }
//           .compact-task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; padding-bottom: 40px; }
//           .compact-card { padding: 16px !important; border-radius: 12px !important; position: relative; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between; }
//           .task-title { font-size: 0.9rem; font-weight: 600; color: white; margin-bottom: 12px; }
//           .timestamp-label { font-size: 8px; text-transform: uppercase; color: var(--text-dim); }
//           .timestamp-value { font-size: 11px; color: rgba(255,255,255,0.9); font-family: monospace; margin-bottom: 8px; }
//           .task-status-overlay { position: absolute; inset: 0; background: #0f172a; border: 1px solid var(--accent); border-radius: 12px; padding: 12px; z-index: 10; display: flex; flex-direction: column; justify-content: center; animation: popIn 0.2s ease-out; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
//           .pop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
//           .pop-title { font-size: 9px; font-weight: bold; color: var(--accent); letter-spacing: 1px; }
//           .pop-close { background: none; border: none; color: white; cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 5px; opacity: 0.6; }
//           .pop-close:hover { opacity: 1; }
//           .task-status-btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
//           .task-status-option { font-size: 10px; padding: 6px 2px; border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.03); transition: 0.2s; border: 1px solid transparent; }
//           .task-status-option:hover { background: rgba(255,255,255,0.1); }
//           .filter-bar { background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid var(--glass-border); }
//           .filter-group { display: flex; align-items: center; gap: 10px; }
//           .filter-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
//           .filter-input { background: #0f172a; border: 1px solid var(--glass-border); color: white; padding: 5px 10px; border-radius: 6px; font-size: 12px; outline: none; }
//           .filter-toggle { display: flex; background: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border); }
//           .toggle-btn { padding: 6px 12px; font-size: 10px; border: none; background: transparent; color: var(--text-dim); cursor: pointer; transition: 0.2s; }
//           .toggle-btn.active { background: var(--accent); color: white; }
          
//           @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//           @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//           .completion-badge, .remaining-badge { margin-top: 8px; padding: 6px; border-radius: 6px; text-align: center; }
//           .completion-badge { background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; }
//           .remaining-badge { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); }
//         `}
//       </style>

//       <div className="console-container">
//         {!selectedCategory ? (
//           <div
//             className="summary-view"
//             style={{ animation: "fadeIn 0.5s ease" }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "25px",
//                 padding: "0 5px",
//               }}>
//               <h2
//                 style={{
//                   fontWeight: "400",
//                   letterSpacing: "0.5px",
//                   margin: 0,
//                 }}>
//                 Workflow <span style={{ color: "var(--accent)" }}>Console</span>
//               </h2>
//               <div style={{ display: "flex", gap: "15px" }}>
//                 <div className="burn-badge" style={{ fontSize: "11px" }}>
//                   SYSTEM LOAD: {totalLoad} NODES
//                 </div>
//                 {avgCycleTime && (
//                   <div className="time-badge" style={{ fontSize: "11px" }}>
//                     AV. CYCLE: {calculateDuration(0, avgCycleTime)}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="stat-grid-compact">
//               {stats.map((s) => (
//                 <div
//                   key={s.name}
//                   className="small-stat-card"
//                   onClick={() => setSelectedCategory(s.name)}>
//                   <div
//                     style={{
//                       color: s.color,
//                       fontSize: "15px",
//                       fontWeight: "bold",
//                     }}>
//                     {s.name.toUpperCase()}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "2.5rem",
//                       fontWeight: "bold",
//                       margin: "8px 0",
//                     }}>
//                     {s.value}
//                   </div>
//                   <div style={{ opacity: 0.4, fontSize: "9px" }}>
//                     TOTAL NODES
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="analytics-grid">
//               <div className="system-gauge-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     alignSelf: "flex-start",
//                     color: "var(--text-dim)",
//                     opacity: 0.6,
//                     margin: 0,
//                   }}>
//                   System capacity
//                 </h3>
//                 <div
//                   style={{
//                     height: "250px",
//                     width: "100%",
//                     position: "relative",
//                   }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={stats}
//                         startAngle={180}
//                         endAngle={0}
//                         innerRadius={90}
//                         outerRadius={125}
//                         paddingAngle={5}
//                         dataKey="value"
//                         stroke="none"
//                         animationBegin={0}
//                         animationDuration={600}
//                         isAnimationActive={true}>
//                         {stats.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <RechartsTooltip
//                         contentStyle={{
//                           background: "#020617",
//                           border: "none",
//                           borderRadius: "8px",
//                           fontSize: "12px",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "10px",
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                       textAlign: "center",
//                     }}>
//                     <div style={{ fontSize: "28px", fontWeight: "bold" }}>
//                       {totalLoad}
//                     </div>
//                     <div style={{ fontSize: "10px", opacity: 0.5 }}>
//                       ACTIVE WIP
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="at-risk-pane glass">
//                 <h3
//                   style={{
//                     fontSize: "1rem",
//                     fontWeight: "500",
//                     marginBottom: "15px",
//                     marginTop: 0,
//                     color: "var(--danger)",
//                   }}>
//                   Nodes Requiring Attention ({attentionFeed.length})
//                 </h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "10px",
//                   }}>
//                   {attentionFeed.length === 0 && (
//                     <div
//                       style={{
//                         color: "var(--success)",
//                         textAlign: "center",
//                         padding: "50px 0",
//                         fontSize: "13px",
//                       }}>
//                       ✓ System Stable.
//                     </div>
//                   )}
//                   {attentionFeed.map((t) => (
//                     <div
//                       key={t._id}
//                       className="glass talent-item"
//                       style={{
//                         borderColor: "var(--danger)",
//                         background: "rgba(255, 71, 87, 0.05)",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "12px",
//                       }}>
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <span
//                           style={{
//                             color: "var(--danger)",
//                             fontSize: "8px",
//                             fontWeight: "bold",
//                           }}>
//                           DELAYED
//                         </span>
//                         <strong style={{ fontSize: "13px" }}>{t.title}</strong>
//                         <small style={{ fontSize: "10px" }}>
//                           In {t.status}
//                         </small>
//                       </div>
//                       <div
//                         className="time-badge"
//                         style={{
//                           color: "var(--danger)",
//                           background: "rgba(255, 71, 87, 0.1)",
//                           borderColor: "var(--danger)",
//                         }}>
//                         D:{" "}
//                         {new Date(t.deadline).toLocaleDateString([], {
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div
//             className="detail-view"
//             style={{
//               animation: "fadeIn 0.4s ease",
//               height: "100%",
//               overflowY:
//                 "auto" /* Allow scrolling only for the long list of tasks */,
//               paddingRight: "10px",
//             }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "20px",
//               }}>
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <button
//                   className="action-btn small"
//                   onClick={() => {
//                     setSelectedCategory(null);
//                     setFilterDate(""); // Reset filter on back
//                   }}>
//                   ← BACK
//                 </button>
//                 <h3
//                   style={{
//                     margin: 0,
//                     color: columnConfig.find((c) => c.id === selectedCategory)
//                       .color,
//                   }}>
//                   {selectedCategory} PHASE
//                 </h3>
//               </div>

//               <div className="filter-bar" style={{ margin: 0 }}>
//                 <div className="filter-group">
//                   <span className="filter-label">Filter:</span>
//                   <div className="filter-toggle">
//                     <button
//                       className={`toggle-btn ${filterMode === "assignedAt" ? "active" : ""}`}
//                       onClick={() => setFilterMode("assignedAt")}>
//                       Assigned
//                     </button>
//                     <button
//                       className={`toggle-btn ${filterMode === "deadline" ? "active" : ""}`}
//                       onClick={() => setFilterMode("deadline")}>
//                       Due
//                     </button>
//                   </div>
//                 </div>
//                 <div className="filter-group">
//                   <input
//                     type="date"
//                     className="filter-input"
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                   />
//                   {filterDate && (
//                     <button
//                       style={{
//                         background: "none",
//                         border: "none",
//                         color: "var(--danger)",
//                         cursor: "pointer",
//                         fontSize: "10px",
//                       }}
//                       onClick={() => setFilterDate("")}>
//                       CLEAR
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {filteredTasks.length === 0 ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: "100px 40px",
//                   opacity: 0.5,
//                 }}>
//                 No tasks match the selected criteria.
//               </div>
//             ) : (
//               <div className="compact-task-grid">
//                 {filteredTasks.map((t) => {
//                   const isActive = activePopover === t._id;
//                   const isOverdue =
//                     new Date(t.deadline) < now &&
//                     selectedCategory !== "Completed";
//                   const remainingText = getTimeRemaining(t.deadline);
//                   const col = columnConfig.find(
//                     (c) => c.id === selectedCategory,
//                   );

//                   return (
//                     <div key={t._id} style={{ position: "relative" }}>
//                       <div
//                         className="glass card compact-card"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActivePopover(isActive ? null : t._id);
//                         }}
//                         style={{
//                           borderLeft: `4px solid ${col.color}`,
//                           background: isActive
//                             ? "rgba(255,255,255,0.12)"
//                             : "rgba(255,255,255,0.04)",
//                           cursor: "pointer",
//                         }}>
//                         <div className="task-title">{t.title}</div>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "2px",
//                           }}>
//                           <div>
//                             <div className="timestamp-label">Assigned At</div>
//                             <div className="timestamp-value">
//                               {new Date(
//                                 t.assignedAt || t.createdAt,
//                               ).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="timestamp-label">Due Deadline</div>
//                             <div
//                               className="timestamp-value"
//                               style={{
//                                 color: isOverdue ? "var(--danger)" : "inherit",
//                               }}>
//                               {new Date(t.deadline).toLocaleString([], {
//                                 dateStyle: "short",
//                                 timeStyle: "short",
//                               })}
//                             </div>
//                           </div>
//                         </div>

//                         {t.status === "Completed" && t.completedAt ? (
//                           <div className="completion-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "#2ecc71" }}>
//                               Total Workflow Time
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "bold",
//                                 color: "white",
//                               }}>
//                               {calculateDuration(
//                                 t.assignedAt || t.createdAt,
//                                 t.completedAt,
//                               )}
//                             </div>
//                           </div>
//                         ) : isOverdue ? (
//                           <div
//                             style={{
//                               marginTop: "10px",
//                               color: "#ff4757",
//                               fontSize: "8px",
//                               fontWeight: "bold",
//                               textAlign: "center",
//                               letterSpacing: "1px",
//                             }}>
//                             ⚠️ CRITICAL DELAY
//                           </div>
//                         ) : (
//                           <div className="remaining-badge">
//                             <div
//                               className="timestamp-label"
//                               style={{ color: "var(--accent)" }}>
//                               Time Remaining
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 fontWeight: "600",
//                                 color: "white",
//                               }}>
//                               {remainingText || "Calculating..."}
//                             </div>
//                           </div>
//                         )}

//                         {isActive && (
//                           <div
//                             className="task-status-overlay"
//                             onClick={(e) => e.stopPropagation()}>
//                             <div className="pop-header">
//                               <span className="pop-title">SET PHASE</span>
//                               <button
//                                 className="pop-close"
//                                 onClick={() => setActivePopover(null)}>
//                                 &times;
//                               </button>
//                             </div>
//                             <div className="task-status-btn-grid">
//                               {columnConfig.map((btn) => (
//                                 <button
//                                   key={btn.id}
//                                   className="task-status-option"
//                                   onClick={(e) =>
//                                     updateStatus(t._id, btn.id, e)
//                                   }
//                                   style={{
//                                     borderColor:
//                                       btn.id === t.status
//                                         ? btn.color
//                                         : btn.color + "44",
//                                     color: btn.color,
//                                   }}>
//                                   {btn.id}
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

/* ---------------- LEAVE CENTER ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [leave, setLeave] = useState({
//     startDate: "",
//     endDate: "",
//     category: "Casual",
//     reason: "",
//   });

//   const fetchData = async () => {
//     try {
//       const hist = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(hist.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const d1 = new Date(start);
//     const d2 = new Date(end);
//     const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const submitLeave = async () => {
//     const start = new Date(leave.startDate);
//     const end = new Date(leave.endDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // RULE 1: Date Validation
//     if (!leave.startDate || !leave.endDate)
//       return showToast("Dates required", "error");
//     if (start < today) return showToast("Cannot apply for past dates", "error");
//     if (end < start)
//       return showToast("End date must be after start date", "error");

//     // RULE 2: Conflict Detection (Check for overlapping dates)
//     const isOverlapping = history.some((h) => {
//       // Ignore rejected or revoked requests
//       if (h.status === "Rejected" || h.status === "Revoked") return false;
//       const hStart = new Date(h.startDate);
//       const hEnd = new Date(h.endDate);
//       // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
//       return start <= hEnd && end >= hStart;
//     });

//     if (isOverlapping) {
//       return showToast(
//         "Conflict: Dates overlap with an existing request",
//         "error",
//       );
//     }

//     // RULE 3: Casual Leave Notice Period (3 Days)
//     if (leave.category === "Casual") {
//       const noticeDate = new Date();
//       noticeDate.setDate(today.getDate() + 3);
//       if (start < noticeDate) {
//         return showToast(
//           "Casual leave requires 3 days advance notice",
//           "error",
//         );
//       }
//     }

//     try {
//       const duration = calculateDays(leave.startDate, leave.endDate);
//       await axios.post(
//         `${API_URL}/employee/leave`,
//         { ...leave, duration },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       showToast("Leave Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) {
//       showToast(e.response?.data?.error || "Submission failed", "error");
//     }
//   };

//   return (
//     <section className="page-content">
//       {/* <header className="glass top-bar">
//         <h1>Leave Center</h1>
//       </header> */}
//       <div className="glass card" style={{ marginBottom: "20px" }}>
//         <h3>Request Time Off</h3>
//         <div className="leave-form-grid">
//           <div className="form-group">
//             <label>Start Date</label>
//             <input
//               className="glass-input"
//               type="date"
//               value={leave.startDate}
//               onChange={(e) =>
//                 setLeave({ ...leave, startDate: e.target.value })
//               }
//             />
//           </div>
//           <div className="form-group">
//             <label>End Date</label>
//             <input
//               className="glass-input"
//               type="date"
//               value={leave.endDate}
//               onChange={(e) => setLeave({ ...leave, endDate: e.target.value })}
//             />
//           </div>
//           <div className="form-group">
//             <div className="form-group">
//               <label>Category</label>
//               <div className="select-wrapper">
//                 <select
//                   className="custom-select "
//                   value={leave.category}
//                   onChange={(e) =>
//                     setLeave({ ...leave, category: e.target.value })
//                   }>
//                   <option value="Casual">Casual</option>
//                   <option value="Medical">Medical</option>
//                   <option value="Emergency">Emergency</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="form-group full-width">
//             <label>Description (Optional)</label>
//             <input
//               className="glass-input"
//               placeholder="Brief explanation..."
//               value={leave.reason}
//               onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
//             />
//           </div>
//         </div>
//         <p style={{ marginTop: "10px", opacity: 0.8 }}>
//           Calculated Duration:{" "}
//           <strong>{calculateDays(leave.startDate, leave.endDate)} days</strong>
//         </p>
//         <button
//           className="action-btn"
//           onClick={submitLeave}
//           style={{ marginTop: "15px" }}>
//           Submit Request
//         </button>
//       </div>

//       <div className="glass card">
//         <h3>My Leave History</h3>
//         <table className="sync-table">
//           <thead>
//             <tr>
//               <th>From</th>
//               <th>To</th>
//               <th>Total Days</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {history.map((h) => (
//               <tr key={h._id}>
//                 <td>{new Date(h.startDate).toLocaleDateString()}</td>
//                 <td>{new Date(h.endDate).toLocaleDateString()}</td>
//                 <td>{h.duration}</td>
//                 <td>
//                   <span className="cat-badge">{h.category}</span>
//                 </td>
//                 <td>{h.reason || "—"}</td>
//                 <td>
//                   <span className={`status-pill ${h.status.toLowerCase()}`}>
//                     {h.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }

// /* ---------------- LEAVE CENTER (REDESIGNED) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [leave, setLeave] = useState({
//     startDate: "",
//     endDate: "",
//     category: "Casual",
//     reason: "",
//   });

//   // Example leave limits (these could come from your API later)
//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const hist = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(hist.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const d1 = new Date(start);
//     const d2 = new Date(end);
//     const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const usedDays = (category) => {
//     return history
//       .filter((h) => h.category === category && h.status === "Approved")
//       .reduce((sum, h) => sum + h.duration, 0);
//   };

//   const submitLeave = async () => {
//     const start = new Date(leave.startDate);
//     const end = new Date(leave.endDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (!leave.startDate || !leave.endDate) return showToast("Dates required", "error");
//     if (start < today) return showToast("Cannot apply for past dates", "error");
//     if (end < start) return showToast("End date must be after start date", "error");

//     const isOverlapping = history.some((h) => {
//       if (h.status === "Rejected" || h.status === "Revoked") return false;
//       const hStart = new Date(h.startDate);
//       const hEnd = new Date(h.endDate);
//       return start <= hEnd && end >= hStart;
//     });

//     if (isOverlapping) return showToast("Conflict: Dates overlap with existing request", "error");

//     if (leave.category === "Casual") {
//       const noticeDate = new Date();
//       noticeDate.setDate(today.getDate() + 3);
//       if (start < noticeDate) return showToast("Casual leave requires 3 days notice", "error");
//     }

//     try {
//       const duration = calculateDays(leave.startDate, leave.endDate);
//       await axios.post(
//         `${API_URL}/employee/leave`,
//         { ...leave, duration },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("Leave Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) {
//       showToast(e.response?.data?.error || "Submission failed", "error");
//     }
//   };

//   return (
//     <section className="page-content" style={{ padding: "20px" }}>
//       <style>
//         {`
//           .leave-grid { display: grid; grid-template-columns: 1fr 350px; gap: 20px; }
//           .balance-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
//           .balance-card { background: var(--glass); padding: 20px; border-radius: 16px; border: 1px solid var(--glass-border); text-align: center; }
//           .balance-val { font-size: 1.8rem; font-weight: bold; display: block; margin: 5px 0; }
//           .balance-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }
//           .progress-mini { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 10px; overflow: hidden; }
//           .progress-fill { height: 100%; transition: 0.5s ease; }
          
//           .form-side { background: var(--glass); border-radius: 20px; padding: 25px; border: 1px solid var(--glass-border); }
//           .history-side { background: rgba(0,0,0,0.1); border-radius: 20px; padding: 5px; }
          
//           .status-row { display: flex; align-items: center; padding: 15px; background: var(--glass); border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--glass-border); transition: 0.2s; }
//           .status-row:hover { transform: translateX(5px); border-color: var(--accent); }
//           .date-box { text-align: center; padding-right: 15px; border-right: 1px solid rgba(255,255,255,0.1); min-width: 80px; }
//           .date-day { font-size: 1.2rem; font-weight: bold; display: block; }
//           .date-month { font-size: 0.7rem; opacity: 0.6; text-transform: uppercase; }
//           .leave-info { flex: 1; padding: 0 20px; }
//           .leave-info h4 { margin: 0; font-size: 0.9rem; font-weight: 500; }
//           .leave-info p { margin: 2px 0 0; font-size: 0.8rem; opacity: 0.5; }
          
//           @media (max-width: 1000px) { .leave-grid { grid-template-columns: 1fr; } }
//         `}
//       </style>

//       {/* 1. TOP BALANCE GAUGE */}
//       <div className="balance-cards">
//         {Object.keys(limits).map((cat) => {
//           const used = usedDays(cat);
//           const limit = limits[cat];
//           const percent = Math.min((used / limit) * 100, 100);
//           const colors = { Casual: "#a29bfe", Medical: "#55efc4", Emergency: "#fab1a0" };
          
//           return (
//             <div className="balance-card" key={cat}>
//               <span className="balance-label">{cat} Balance</span>
//               <span className="balance-val" style={{ color: colors[cat] }}>
//                 {limit - used} <small style={{ fontSize: "12px", opacity: 0.5 }}>/ {limit}</small>
//               </span>
//               <div className="progress-mini">
//                 <div className="progress-fill" style={{ width: `${percent}%`, background: colors[cat] }}></div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="leave-grid">
//         {/* 2. HISTORY LIST (Left Side) */}
//         <div className="history-side">
//           <h3 style={{ margin: "10px 0 20px 10px", fontWeight: "400" }}>Recent Applications</h3>
//           {history.length === 0 && (
//             <div style={{ padding: "40px", textAlign: "center", opacity: 0.5 }}>No records found.</div>
//           )}
//           {history.slice().reverse().map((h) => {
//             const startDate = new Date(h.startDate);
//             return (
//               <div className="status-row" key={h._id}>
//                 <div className="date-box">
//                   <span className="date-month">{startDate.toLocaleString('default', { month: 'short' })}</span>
//                   <span className="date-day">{startDate.getDate()}</span>
//                 </div>
//                 <div className="leave-info">
//                   <h4>{h.category} Leave • {h.duration} Days</h4>
//                   <p>{h.reason || "No description provided"}</p>
//                 </div>
//                 <div className="status-tag">
//                    <span className={`status-pill ${h.status.toLowerCase()}`}>
//                     {h.status}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* 3. SUBMISSION FORM (Right Side) */}
//         <div className="form-side">
//           <h3 style={{ marginBottom: "20px" }}>New Request</h3>
//           <div className="form-group">
//             <label className="timestamp-label">Leave Category</label>
//             <div className="select-wrapper">
//               <select 
//                 className="custom-select" 
//                 value={leave.category}
//                 onChange={(e) => setLeave({ ...leave, category: e.target.value })}
//               >
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Medical">Medical Leave</option>
//                 <option value="Emergency">Emergency Leave</option>
//               </select>
//             </div>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px" }}>
//             <div className="form-group">
//               <label className="timestamp-label">Start Date</label>
//               <input
//                 className="glass-input"
//                 type="date"
//                 value={leave.startDate}
//                 onChange={(e) => setLeave({ ...leave, startDate: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <label className="timestamp-label">End Date</label>
//               <input
//                 className="glass-input"
//                 type="date"
//                 value={leave.endDate}
//                 onChange={(e) => setLeave({ ...leave, endDate: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="form-group" style={{ marginTop: "15px" }}>
//             <label className="timestamp-label">Reason for Leave</label>
//             <textarea
//               className="glass-input"
//               rows="3"
//               placeholder="Provide a brief reason..."
//               style={{ resize: "none", padding: "12px" }}
//               value={leave.reason}
//               onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
//             />
//           </div>

//           <div 
//             style={{ 
//               marginTop: "20px", 
//               padding: "15px", 
//               background: "rgba(255,255,255,0.05)", 
//               borderRadius: "12px",
//               textAlign: "center",
//               border: "1px dashed rgba(255,255,255,0.2)"
//             }}
//           >
//             <div className="timestamp-label">Calculated Duration</div>
//             <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
//               {calculateDays(leave.startDate, leave.endDate)} Days
//             </div>
//           </div>

//           <button className="action-btn" onClick={submitLeave} style={{ width: "100%", marginTop: "20px" }}>
//             Confirm & Submit
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
// /* ---------------- LEAVE CENTER (COMPACT & FIXED) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [leave, setLeave] = useState({
//     startDate: "",
//     endDate: "",
//     category: "Casual",
//     reason: "",
//   });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const hist = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(hist.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const d1 = new Date(start);
//     const d2 = new Date(end);
//     const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const usedDays = (category) => {
//     return history
//       .filter((h) => h.category === category && h.status === "Approved")
//       .reduce((sum, h) => sum + h.duration, 0);
//   };

//   const submitLeave = async () => {
//     const start = new Date(leave.startDate);
//     const end = new Date(leave.endDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (!leave.startDate || !leave.endDate) return showToast("Dates required", "error");
//     if (start < today) return showToast("Cannot apply for past dates", "error");
//     if (end < start) return showToast("End date must be after start date", "error");

//     const isOverlapping = history.some((h) => {
//       if (h.status === "Rejected" || h.status === "Revoked") return false;
//       const hStart = new Date(h.startDate);
//       const hEnd = new Date(h.endDate);
//       return start <= hEnd && end >= hStart;
//     });

//     if (isOverlapping) return showToast("Conflict: Dates overlap", "error");

//     try {
//       const duration = calculateDays(leave.startDate, leave.endDate);
//       await axios.post(
//         `${API_URL}/employee/leave`,
//         { ...leave, duration },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) {
//       showToast(e.response?.data?.error || "Submission failed", "error");
//     }
//   };

//   return (
//     <section className="page-content" style={{ padding: "15px", maxWidth: "900px", margin: "0 auto" }}>
//       <style>
//         {`
//           .compact-container { display: flex; flex-direction: column; gap: 15px; }
          
//           /* Slim Balance Cards */
//           .balance-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
//           .mini-balance-card { background: var(--glass); padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; align-items: center;}
//           .mini-val { font-size: 1.2rem; font-weight: bold; line-height: 1; margin-top: 4px; }
//           .mini-label { font-size: 9px; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.5px; }
          
//           /* Main Layout Split */
//           .content-split { display: grid; grid-template-columns: 320px 1fr; gap: 15px; }
          
//           /* Form Styling */
//           .slim-form { background: var(--glass); border-radius: 16px; padding: 20px; border: 1px solid var(--glass-border); height: fit-content; }
          
//           /* Condensed History */
//           .compact-history { background: rgba(0,0,0,0.15); border-radius: 16px; padding: 15px; overflow-y: auto; max-height: 500px; }
//           .slim-row { display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px; border: 1px solid transparent; font-size: 13px; }
//           .slim-row:hover { border-color: var(--accent-soft); background: rgba(255,255,255,0.06); }
          
//           .slim-date { min-width: 45px; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); margin-right: 12px; padding-right: 8px; }
//           .slim-cat { font-weight: 600; font-size: 12px; flex: 1; }
//           .slim-days { font-size: 11px; opacity: 0.6; }
          
//           .status-pill.small { padding: 2px 8px; font-size: 9px; }

//           @media (max-width: 800px) { .content-split { grid-template-columns: 1fr; } }
//         `}
//       </style>

//       <div className="compact-container">
        
//         {/* 1. COMPACT BALANCE STRIP */}
//         <div className="balance-strip">
//           {Object.keys(limits).map((cat) => {
//             const used = usedDays(cat);
//             const available = limits[cat] - used;
//             const colors = { Casual: "#a29bfe", Medical: "#55efc4", Emergency: "#fab1a0" };
//             return (
//               <div className="mini-balance-card" key={cat}>
//                 <span className="mini-label">{cat} Left</span>
//                 <span className="mini-val" style={{ color: colors[cat] }}>{available}</span>
//               </div>
//             );
//           })}
//         </div>

//         <div className="content-split">
//           {/* 2. SLIM FORM (Fixed Width) */}
//           <div className="slim-form">
//             <h4 style={{ marginBottom: "15px", fontSize: "14px" }}>New Request</h4>
            
//             <div className="form-group">
//               <label className="timestamp-label" style={{ fontSize: "9px" }}>Category</label>
//               <select 
//                 className="custom-select" 
//                 style={{ padding: "8px", fontSize: "12px" }}
//                 value={leave.category}
//                 onChange={(e) => setLeave({ ...leave, category: e.target.value })}
//               >
//                 <option value="Casual">Casual</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Emergency">Emergency</option>
//               </select>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
//               <div className="form-group">
//                 <label className="timestamp-label" style={{ fontSize: "9px" }}>Start</label>
//                 <input
//                   className="glass-input"
//                   style={{ padding: "8px", fontSize: "11px" }}
//                   type="date"
//                   value={leave.startDate}
//                   onChange={(e) => setLeave({ ...leave, startDate: e.target.value })}
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="timestamp-label" style={{ fontSize: "9px" }}>End</label>
//                 <input
//                   className="glass-input"
//                   style={{ padding: "8px", fontSize: "11px" }}
//                   type="date"
//                   value={leave.endDate}
//                   onChange={(e) => setLeave({ ...leave, endDate: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="form-group" style={{ marginTop: "12px" }}>
//               <label className="timestamp-label" style={{ fontSize: "9px" }}>Reason</label>
//               <textarea
//                 className="glass-input"
//                 rows="2"
//                 style={{ padding: "8px", fontSize: "12px", resize: "none" }}
//                 value={leave.reason}
//                 onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
//               />
//             </div>

//             <div style={{ marginTop: "15px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", textAlign: "center" }}>
//               <span style={{ fontSize: "11px", opacity: 0.6 }}>Duration: </span>
//               <span style={{ fontSize: "11px", fontWeight: "bold" }}>{calculateDays(leave.startDate, leave.endDate)} Days</span>
//             </div>

//             <button className="action-btn" onClick={submitLeave} style={{ width: "100%", marginTop: "15px", padding: "10px", fontSize: "13px" }}>
//               Submit
//             </button>
//           </div>

//           {/* 3. CONDENSED HISTORY */}
//           <div className="compact-history">
//             <h4 style={{ marginBottom: "12px", fontSize: "14px", opacity: 0.8 }}>History</h4>
//             {history.length === 0 ? (
//               <div style={{ fontSize: "12px", opacity: 0.4, textAlign: "center", marginTop: "20px" }}>No logs found</div>
//             ) : (
//               history.slice().reverse().map((h) => {
//                 const date = new Date(h.startDate);
//                 return (
//                   <div className="slim-row" key={h._id}>
//                     <div className="slim-date">
//                       <div style={{ fontSize: "12px", fontWeight: "bold" }}>{date.getDate()}</div>
//                       <div style={{ fontSize: "8px", opacity: 0.5, textTransform: "uppercase" }}>{date.toLocaleString('default', { month: 'short' })}</div>
//                     </div>
//                     <div className="slim-cat">
//                       {h.category} 
//                       <div className="slim-days">{h.duration} Days</div>
//                     </div>
//                     <span className={`status-pill small ${h.status.toLowerCase()}`}>
//                       {h.status}
//                     </span>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// /* ---------------- LEAVE CENTER (ALIGNED & FILTERABLE) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [filters, setFilters] = useState({ date: "", category: "All", days: "" });
//   const [leave, setLeave] = useState({ startDate: "", endDate: "", category: "Casual", reason: "" });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const hist = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(hist.data);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   // Filter Logic
//   const filteredHistory = useMemo(() => {
//     return history.filter(h => {
//       const matchDate = filters.date ? h.startDate.includes(filters.date) : true;
//       const matchCat = filters.category !== "All" ? h.category === filters.category : true;
//       const matchDays = filters.days ? h.duration === parseInt(filters.days) : true;
//       return matchDate && matchCat && matchDays;
//     }).reverse();
//   }, [history, filters]);

//   return (
//     <section className="page-content" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <style>
//         {`
//           .leave-main-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: stretch; }
//           .glass-panel { background: var(--glass); border-radius: 20px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; }
          
//           /* Sync Heights */
//           .form-container { padding: 25px; height: 380px; }
//           .history-container { height: 430px; position: relative; width:730px}

//           /* Filter Bar */
//           .filter-bar { display: grid; grid-template-columns: 1fr 1fr 80px; gap: 8px; padding: 15px; background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--glass-border); }
//           .filter-input { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 6px; font-size: 11px; }

//           /* Scrollable Area */
//           .scroll-list { flex: 1; overflow-y: auto; padding: 15px; scrollbar-width: thin; scrollbar-color: var(--accent) transparent; }
//           .scroll-list::-webkit-scrollbar { width: 6px; }
//           .scroll-list::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }

//           .history-item { display: flex; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px; border: 1px solid transparent; }
//           .history-item:hover { border-color: var(--accent-soft); }
//         `}
//       </style>

//       {/* 1. TOP STATS BAR */}
//       <div className="balance-strip" style={{ marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", width:"1130px"}}>
//         {Object.keys(limits).map(cat => (
//           <div className="mini-balance-card" key={cat} style={{ background: 'var(--glass)', padding: '15px', borderRadius: '15px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
//             <span style={{ fontSize: '10px', opacity: 0.6, textTransform: 'uppercase' }}>{cat} Remaining</span>
//             <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{limits[cat] - (history.filter(h => h.category === cat && h.status === "Approved").reduce((s, r) => s + r.duration, 0))}</div>
//           </div>
//         ))}
//       </div>

//       <div className="leave-main-layout">
//         {/* 2. REQUEST FORM */}
//         <div className="glass-panel form-container">
//           <h3>New Request</h3>
//           <div className="form-group" style={{ marginTop: "15px" }}>
//             <label>Category</label>
//             <select className="custom-select" value={leave.category} onChange={e => setLeave({...leave, category: e.target.value})}>
//               <option value="Casual">Casual</option>
//               <option value="Medical">Medical</option>
//               <option value="Emergency">Emergency</option>
//             </select>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" }}>
//             <div className="form-group">
//               <label>Start Date</label>
//               <input type="date" className="glass-input" value={leave.startDate} onChange={e => setLeave({...leave, startDate: e.target.value})} />
//             </div>
//             <div className="form-group">
//               <label>End Date</label>
//               <input type="date" className="glass-input" value={leave.endDate} onChange={e => setLeave({...leave, endDate: e.target.value})} />
//             </div>
//           </div>
//           <div className="form-group" style={{ marginTop: "20px", flex: 1 }}>
//             <label>Reason</label>
//             <textarea className="glass-input" rows="4" style={{ resize: "none" }} value={leave.reason} onChange={e => setLeave({...leave, reason: e.target.value})} />
//           </div>
//           <button className="action-btn" style={{ width: "100%", marginTop: "20px" }}>Submit Request</button>
//         </div>

//         {/* 3. FILTERABLE HISTORY */}
//         <div className="glass-panel history-container">
//           <div className="filter-bar">
//             <input type="date" className="filter-input" onChange={e => setFilters({...filters, date: e.target.value})} />
//             <select className="filter-input" onChange={e => setFilters({...filters, category: e.target.value})}>
//               <option value="All">All Categories</option>
//               <option value="Casual">Casual</option>
//               <option value="Medical">Medical</option>
//               <option value="Emergency">Emergency</option>
//             </select>
//             <input type="number" placeholder="Days" className="filter-input" onChange={e => setFilters({...filters, days: e.target.value})} />
//           </div>

//           <div className="scroll-list">
//             {filteredHistory.length > 0 ? filteredHistory.map(h => (
//               <div className="history-item" key={h._id}>
//                 <div style={{ minWidth: "50px", borderRight: "1px solid rgba(255,255,255,0.1)", marginRight: "15px" }}>
//                   <div style={{ fontWeight: "bold" }}>{new Date(h.startDate).getDate()}</div>
//                   <div style={{ fontSize: "10px", opacity: 0.5 }}>{new Date(h.startDate).toLocaleString('default', { month: 'short' })}</div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: "14px", fontWeight: "500" }}>{h.category} Leave</div>
//                   <div style={{ fontSize: "11px", opacity: 0.6 }}>{h.duration} days • {h.status}</div>
//                 </div>
//                 <span className={`status-pill small ${h.status.toLowerCase()}`}>{h.status}</span>
//               </div>
//             )) : <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.5 }}>No records match filters</div>}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- LEAVE CENTER (IMPROVED LAYOUT & DETAILS) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [filters, setFilters] = useState({ date: "", category: "All", days: "" });
//   const [leave, setLeave] = useState({ startDate: "", endDate: "", category: "Casual", reason: "" });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const hist = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(hist.data);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const filteredHistory = useMemo(() => {
//     return history.filter(h => {
//       const matchDate = filters.date ? h.startDate.includes(filters.date) : true;
//       const matchCat = filters.category !== "All" ? h.category === filters.category : true;
//       const matchDays = filters.days ? h.duration === parseInt(filters.days) : true;
//       return matchDate && matchCat && matchDays;
//     }).reverse();
//   }, [history, filters]);

//   const submitLeave = async () => {
//     const duration = calculateDays(leave.startDate, leave.endDate);
//     if (duration <= 0) return showToast("Invalid date range", "error");
//     try {
//       await axios.post(`${API_URL}/employee/leave`, { ...leave, duration }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast("Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) { showToast("Submission failed", "error"); }
//   };

//   return (
//     <section
//       className="page-content"
//       style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <style>
//         {`
//           .leave-layout-wrapper { display: flex; flex-direction: column; gap: 20px; width: 100%; }
//           .balance-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; }
//           .leave-main-grid { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: stretch; }
          
//           .glass-panel { background: var(--glass); border-radius: 20px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; overflow: hidden; }
//           .form-container { padding: 25px; height: 380px; }
//           .history-container { height: 430px; width:730px}

//           .filter-bar { display: grid; grid-template-columns: 1.2fr 1.2fr 0.6fr; gap: 10px; padding: 8px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--glass-border); width:680px; margin-left:10px; margin-right:10px}
//           .filter-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; font-size: 12px; outline: none; }

//           .scroll-list { flex: 1; overflow-y: auto; padding: 15px; max-height: 450px; }
//           .history-item { display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px; border: 1px solid transparent; transition: 0.3s; }
//           .history-item:hover { border-color: var(--accent-soft); background: rgba(255,255,255,0.06); }
          
//           .date-range-box { min-width: 100px; border-right: 1px solid rgba(255,255,255,0.1); margin-right: 15px; display: flex; flex-direction: column; justify-content: center; }
//           .date-sub { font-size: 10px; opacity: 0.5; text-transform: uppercase; margin-bottom: 2px; }
//           .date-val { font-size: 13px; font-weight: bold; color: var(--accent); }

//           .leave-desc { font-size: 11px; opacity: 0.6; margin-top: 4px; font-style: italic; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
          
//           .status-pill.small { padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 6px; text-transform: uppercase; }
//         `}
//       </style>

//       <div className="leave-layout-wrapper">
//         {/* 1. TOP STATS */}
//         <div className="balance-strip">
//           {Object.keys(limits).map((cat) => (
//             <div
//               className="mini-balance-card"
//               key={cat}
//               style={{
//                 background: "var(--glass)",
//                 padding: "20px",
//                 borderRadius: "15px",
//                 textAlign: "center",
//                 border: "1px solid var(--glass-border)",
//                 width: "300px",
//               }}>
//               <span
//                 style={{
//                   fontSize: "11px",
//                   opacity: 0.6,
//                   textTransform: "uppercase",
//                   letterSpacing: "1px",
//                 }}>
//                 {cat} Remaining
//               </span>
//               <div
//                 style={{
//                   fontSize: "1.8rem",
//                   fontWeight: "bold",
//                   marginTop: "5px",
//                 }}>
//                 {limits[cat] -
//                   history
//                     .filter(
//                       (h) => h.category === cat && h.status === "Approved",
//                     )
//                     .reduce((s, r) => s + r.duration, 0)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="leave-main-grid">
//           {/* 2. REQUEST FORM */}
//           <div className="glass-panel form-container">
//             <h3 style={{ marginBottom: "20px" }}>New Request</h3>
//             <div className="form-group">
//               <label className="timestamp-label">Leave Category</label>
//               <select
//                 className="custom-select"
//                 value={leave.category}
//                 onChange={(e) =>
//                   setLeave({ ...leave, category: e.target.value })
//                 }>
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Medical">Medical Leave</option>
//                 <option value="Emergency">Emergency Leave</option>
//               </select>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "15px",
//                 marginTop: "20px",
//               }}>
//               <div className="form-group">
//                 <label className="timestamp-label">Start Date</label>
//                 <input
//                   type="date"
//                   className="glass-input"
//                   value={leave.startDate}
//                   onChange={(e) =>
//                     setLeave({ ...leave, startDate: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="timestamp-label">End Date</label>
//                 <input
//                   type="date"
//                   className="glass-input"
//                   value={leave.endDate}
//                   onChange={(e) =>
//                     setLeave({ ...leave, endDate: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="form-group" style={{ marginTop: "20px", flex: 1 }}>
//               <label className="timestamp-label">Reason</label>
//               <textarea
//                 className="glass-input"
//                 rows="3"
//                 placeholder="Explain your leave..."
//                 style={{ resize: "none" }}
//                 value={leave.reason}
//                 onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
//               />
//             </div>
//             <button
//               className="action-btn"
//               onClick={submitLeave}
//               style={{ width: "100%", marginTop: "20px", padding: "12px" }}>
//               Submit Request
//             </button>
//           </div>

//           {/* 3. FILTERABLE HISTORY */}
//           <div className="glass-panel history-container">
//             <h4
//               style={{
//                 marginBottom: "12px",
//                 fontSize: "14px",
//                 opacity: 0.8,
//                 marginLeft: "20px",
//               }}>
//               History
//             </h4>
//             <div className="filter-bar">
//               <input
//                 type="date"
//                 className="filter-input"
//                 onChange={(e) =>
//                   setFilters({ ...filters, date: e.target.value })
//                 }
//               />
//               <select
//                 className="filter-input"
//                 onChange={(e) =>
//                   setFilters({ ...filters, category: e.target.value })
//                 }>
//                 <option value="All">All Categories</option>
//                 <option value="Casual">Casual</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Emergency">Emergency</option>
//               </select>
//               <input
//                 type="number"
//                 placeholder="Days"
//                 className="filter-input"
//                 onChange={(e) =>
//                   setFilters({ ...filters, days: e.target.value })
//                 }
//               />
//             </div>

//             <div className="scroll-list">
//               {filteredHistory.length > 0 ? (
//                 filteredHistory.map((h) => (
//                   <div className="history-item" key={h._id}>
//                     <div className="date-range-box">
//                       <span className="date-sub">Duration</span>
//                       <span className="date-val">
//                         {new Date(h.startDate).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                         })}
//                       </span>
//                       <span style={{ fontSize: "10px", opacity: 0.4 }}>to</span>
//                       <span className="date-val">
//                         {new Date(h.endDate).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                         })}
//                       </span>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: "14px", fontWeight: "600" }}>
//                         {h.category} Leave •{" "}
//                         <span style={{ opacity: 0.7, fontWeight: "400" }}>
//                           {h.duration} Days
//                         </span>
//                       </div>
//                       <div className="leave-desc" title={h.reason}>
//                         {h.reason || "No description provided"}
//                       </div>
//                     </div>
//                     <span
//                       className={`status-pill small ${h.status.toLowerCase()}`}>
//                       {h.status}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <div
//                   style={{
//                     textAlign: "center",
//                     marginTop: "50px",
//                     opacity: 0.3,
//                   }}>
//                   No records match your criteria
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- LEAVE CENTER (LATEST FIRST & ALIGNED) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [filters, setFilters] = useState({ date: "", category: "All", days: "" });
//   const [leave, setLeave] = useState({ startDate: "", endDate: "", category: "Casual", reason: "" });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Assuming res.data is an array of leave objects
//       setHistory(res.data);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   // Filter Logic + Sorting (Latest First)
//   const filteredHistory = useMemo(() => {
//     return history
//       .filter(h => {
//         const matchDate = filters.date ? h.startDate.includes(filters.date) : true;
//         const matchCat = filters.category !== "All" ? h.category === filters.category : true;
//         const matchDays = filters.days ? h.duration === parseInt(filters.days) : true;
//         return matchDate && matchCat && matchDays;
//       })
//       .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)); 
//   }, [history, filters]);

//   const submitLeave = async () => {
//     const duration = calculateDays(leave.startDate, leave.endDate);
//     if (duration <= 0) return showToast("Invalid date range", "error");
//     try {
//       await axios.post(`${API_URL}/employee/leave`, { ...leave, duration }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast("Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) { showToast("Submission failed", "error"); }
//   };

//   return (
//     <section className="page-content" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <style>
//         {`
//           .leave-layout-wrapper { display: flex; flex-direction: column; gap: 20px; width: 100%; }
//           .balance-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; }
//           .leave-main-grid { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: stretch; }
          
//           .glass-panel { background: var(--glass); border-radius: 20px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; overflow: hidden; }
          
//           /* Synced Visual Heights */
//           .form-container { padding: 25px; height: 450px; }
//           .history-container { height: 450px; }

//           .filter-bar { 
//             display: grid; 
//             grid-template-columns: 1.2fr 1.2fr 0.6fr; 
//             gap: 10px; 
//             padding: 12px; 
//             background: rgba(0,0,0,0.2); 
//             border-bottom: 1px solid var(--glass-border);
//             margin: 0 15px 10px 15px;
//             border-radius: 10px;
//           }
//           .filter-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; font-size: 12px; outline: none; }

//           .scroll-list { flex: 1; overflow-y: auto; padding: 0 15px 15px 15px; }
//           /* Custom Scrollbar */
//           .scroll-list::-webkit-scrollbar { width: 6px; }
//           .scroll-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

//           .history-item { display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px; border: 1px solid transparent; transition: 0.3s; }
//           .history-item:hover { border-color: var(--accent-soft); background: rgba(255,255,255,0.06); }
          
//           .date-range-box { min-width: 100px; border-right: 1px solid rgba(255,255,255,0.1); margin-right: 15px; display: flex; flex-direction: column; }
//           .date-sub { font-size: 9px; opacity: 0.5; text-transform: uppercase; }
//           .date-val { font-size: 12px; font-weight: bold; color: var(--accent); }

//           .leave-desc { font-size: 11px; opacity: 0.6; margin-top: 4px; font-style: italic; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
//           .status-pill.small { padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 6px; text-transform: uppercase; margin-left: 10px; }
//         `}
//       </style>

//       <div className="leave-layout-wrapper">
//         {/* 1. TOP STATS */}
//         <div className="balance-strip">
//           {Object.keys(limits).map((cat) => (
//             <div className="mini-balance-card" key={cat} style={{ background: "var(--glass)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px solid var(--glass-border)" }}>
//               <span style={{ fontSize: "11px", opacity: 0.6, textTransform: "uppercase" }}>{cat} Remaining</span>
//               <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "5px" }}>
//                 {limits[cat] - history.filter((h) => h.category === cat && h.status === "Approved").reduce((s, r) => s + r.duration, 0)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="leave-main-grid">
//           {/* 2. REQUEST FORM */}
//           <div className="glass-panel form-container">
//             <h3 style={{ marginBottom: "15px" }}>New Request</h3>
//             <div className="form-group">
//               <label className="timestamp-label">Category</label>
//               <select className="custom-select" value={leave.category} onChange={(e) => setLeave({ ...leave, category: e.target.value })}>
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Medical">Medical Leave</option>
//                 <option value="Emergency">Emergency Leave</option>
//               </select>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
//               <div className="form-group">
//                 <label className="timestamp-label">Start Date</label>
//                 <input type="date" className="glass-input" value={leave.startDate} onChange={(e) => setLeave({ ...leave, startDate: e.target.value })} />
//               </div>
//               <div className="form-group">
//                 <label className="timestamp-label">End Date</label>
//                 <input type="date" className="glass-input" value={leave.endDate} onChange={(e) => setLeave({ ...leave, endDate: e.target.value })} />
//               </div>
//             </div>
//             <div className="form-group" style={{ marginTop: "15px", flex: 1 }}>
//               <label className="timestamp-label">Reason</label>
//               <textarea className="glass-input" rows="3" placeholder="Explain your leave..." style={{ resize: "none" }} value={leave.reason} onChange={(e) => setLeave({ ...leave, reason: e.target.value })} />
//             </div>
//             <button className="action-btn" onClick={submitLeave} style={{ width: "100%", marginTop: "15px", padding: "12px" }}>Submit Request</button>
//           </div>

//           {/* 3. FILTERABLE HISTORY */}
//           <div className="glass-panel history-container">
//             <h4 style={{ margin: "20px 0 10px 20px", fontSize: "14px", opacity: 0.8 }}>Leave History</h4>
            
//             <div className="filter-bar">
//               <input type="date" className="filter-input" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
//               <select className="filter-input" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
//                 <option value="All">All Categories</option>
//                 <option value="Casual">Casual</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Emergency">Emergency</option>
//               </select>
//               <input type="number" placeholder="Days" className="filter-input" onChange={(e) => setFilters({ ...filters, days: e.target.value })} />
//             </div>

//             <div className="scroll-list">
//               {filteredHistory.length > 0 ? (
//                 filteredHistory.map((h) => (
//                   <div className="history-item" key={h._id}>
//                     <div className="date-range-box">
//                       <span className="date-sub">From</span>
//                       <span className="date-val">{new Date(h.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                       <span className="date-sub" style={{marginTop: '4px'}}>To</span>
//                       <span className="date-val">{new Date(h.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: "13px", fontWeight: "600" }}>
//                         {h.category} • <span style={{ opacity: 0.7, fontWeight: "400" }}>{h.duration} Days</span>
//                       </div>
//                       <div className="leave-desc" title={h.reason}>{h.reason || "No description"}</div>
//                     </div>
//                     <span className={`status-pill small ${h.status.toLowerCase()}`}>{h.status}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.3, fontSize: '13px' }}>No records found</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- LEAVE CENTER (LEFT-ALIGNED & LATEST FIRST) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [filters, setFilters] = useState({ date: "", category: "All", days: "" });
//   const [leave, setLeave] = useState({ startDate: "", endDate: "", category: "Casual", reason: "" });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const filteredHistory = useMemo(() => {
//     return history
//       .filter(h => {
//         const matchDate = filters.date ? h.startDate.includes(filters.date) : true;
//         const matchCat = filters.category !== "All" ? h.category === filters.category : true;
//         const matchDays = filters.days ? h.duration === parseInt(filters.days) : true;
//         return matchDate && matchCat && matchDays;
//       })
//       .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)); 
//   }, [history, filters]);

//   const submitLeave = async () => {
//     const duration = calculateDays(leave.startDate, leave.endDate);
//     if (duration <= 0) return showToast("Invalid date range", "error");
//     try {
//       await axios.post(`${API_URL}/employee/leave`, { ...leave, duration }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast("Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) { showToast("Submission failed", "error"); }
//   };

//   return (
//     <section className="page-content" style={{ padding: "20px 40px 20px 20px", maxWidth: "1250px", margin: "0" }}>
//       <style>
//         {`
//           .leave-layout-wrapper { display: flex; flex-direction: column; gap: 10px; width: 95%; }
//           .balance-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; }
//           .leave-main-grid { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: stretch; }
          
//           .glass-panel { background: var(--glass); border-radius: 20px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; overflow: hidden; }
          
//           .form-container { padding: 25px; height: 450px; }
//           .history-container { height: 450px; }

//           .filter-bar { 
//             display: grid; 
//             grid-template-columns: 1.2fr 1.2fr 0.6fr; 
//             gap: 10px; 
//             padding: 12px; 
//             background: rgba(0,0,0,0.2); 
//             border-bottom: 1px solid var(--glass-border);
//             margin: 0 15px 10px 15px;
//             border-radius: 10px;
//           }
//           .filter-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; font-size: 12px; outline: none; }

//           .scroll-list { flex: 1; overflow-y: auto; padding: 0 15px 15px 15px; }
//           .scroll-list::-webkit-scrollbar { width: 6px; }
//           .scroll-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

//           .history-item { display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px; border: 1px solid transparent; transition: 0.3s; }
//           .history-item:hover { border-color: var(--accent-soft); background: rgba(255,255,255,0.06); }
          
//           .date-range-box { min-width: 100px; border-right: 1px solid rgba(255,255,255,0.1); margin-right: 15px; display: flex; flex-direction: column; }
//           .date-sub { font-size: 9px; opacity: 0.5; text-transform: uppercase; }
//           .date-val { font-size: 12px; font-weight: bold; color: var(--accent); }

//           .leave-desc { font-size: 11px; opacity: 0.6; margin-top: 4px; font-style: italic; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
//           .status-pill.small { padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 6px; text-transform: uppercase; margin-left: 10px; }
//         `}
//       </style>

//       <div className="leave-layout-wrapper">
//         <div className="balance-strip">
//           {Object.keys(limits).map((cat) => (
//             <div className="mini-balance-card" key={cat} style={{ background: "var(--glass)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px solid var(--glass-border)" }}>
//               <span style={{ fontSize: "11px", opacity: 0.6, textTransform: "uppercase" }}>{cat} Remaining</span>
//               <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "5px" }}>
//                 {limits[cat] - history.filter((h) => h.category === cat && h.status === "Approved").reduce((s, r) => s + r.duration, 0)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="leave-main-grid">
//           <div className="glass-panel form-container">
//             <h3 style={{ marginBottom: "15px" }}>New Request</h3>
//             <div className="form-group">
//               <label className="timestamp-label">Category</label>
//               <select className="custom-select" value={leave.category} onChange={(e) => setLeave({ ...leave, category: e.target.value })}>
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Medical">Medical Leave</option>
//                 <option value="Emergency">Emergency Leave</option>
//               </select>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
//               <div className="form-group">
//                 <label className="timestamp-label">Start Date</label>
//                 <input type="date" className="glass-input" value={leave.startDate} onChange={(e) => setLeave({ ...leave, startDate: e.target.value })} />
//               </div>
//               <div className="form-group">
//                 <label className="timestamp-label">End Date</label>
//                 <input type="date" className="glass-input" value={leave.endDate} onChange={(e) => setLeave({ ...leave, endDate: e.target.value })} />
//               </div>
//             </div>
//             <div className="form-group" style={{ marginTop: "15px", flex: 1 }}>
//               <label className="timestamp-label">Reason</label>
//               <textarea className="glass-input" rows="3" placeholder="Explain your leave..." style={{ resize: "none" }} value={leave.reason} onChange={(e) => setLeave({ ...leave, reason: e.target.value })} />
//             </div>
//             <button className="action-btn" onClick={submitLeave} style={{ width: "100%", marginTop: "15px", padding: "12px" }}>Submit Request</button>
//           </div>

//           <div className="glass-panel history-container">
//             <h4 style={{ margin: "20px 0 10px 20px", fontSize: "14px", opacity: 0.8 }}>Leave History</h4>
//             <div className="filter-bar">
//               <input type="date" className="filter-input" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
//               <select className="filter-input" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
//                 <option value="All">All Categories</option>
//                 <option value="Casual">Casual</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Emergency">Emergency</option>
//               </select>
//               <input type="number" placeholder="Days" className="filter-input" onChange={(e) => setFilters({ ...filters, days: e.target.value })} />
//             </div>

//             <div className="scroll-list">
//               {filteredHistory.length > 0 ? (
//                 filteredHistory.map((h) => (
//                   <div className="history-item" key={h._id}>
//                     <div className="date-range-box">
//                       <span className="date-sub">From</span>
//                       <span className="date-val">{new Date(h.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                       <span className="date-sub" style={{marginTop: '4px'}}>To</span>
//                       <span className="date-val">{new Date(h.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: "13px", fontWeight: "600" }}>
//                         {h.category} • <span style={{ opacity: 0.7, fontWeight: "400" }}>{h.duration} Days</span>
//                       </div>
//                       <div className="leave-desc" title={h.reason}>{h.reason || "No description"}</div>
//                     </div>
//                     <span className={`status-pill small ${h.status.toLowerCase()}`}>{h.status}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.3, fontSize: '13px' }}>No records found</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- LEAVE CENTER (FIXED HORIZONTAL SCROLL) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [filters, setFilters] = useState({ date: "", category: "All", days: "" });
//   const [leave, setLeave] = useState({ startDate: "", endDate: "", category: "Casual", reason: "" });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const filteredHistory = useMemo(() => {
//     return history
//       .filter(h => {
//         const matchDate = filters.date ? h.startDate.includes(filters.date) : true;
//         const matchCat = filters.category !== "All" ? h.category === filters.category : true;
//         const matchDays = filters.days ? h.duration === parseInt(filters.days) : true;
//         return matchDate && matchCat && matchDays;
//       })
//       .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)); 
//   }, [history, filters]);

//   const submitLeave = async () => {
//     const duration = calculateDays(leave.startDate, leave.endDate);
//     if (duration <= 0) return showToast("Invalid date range", "error");
//     try {
//       await axios.post(`${API_URL}/employee/leave`, { ...leave, duration }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast("Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) { showToast("Submission failed", "error"); }
//   };

//   return (
//     <section 
//       className="page-content" 
//       style={{ 
//         padding: "20px 20px 20px 0", // Reduced padding to prevent push
//         maxWidth: "100%", // Changed from fixed px to 100% to contain children
//         margin: "0",
//         overflowX: "hidden" // Safety net
//       }}>
//       <style>
//         {`
//           /* GLOBAL BOX FIX */
//           .page-content * { box-sizing: border-box; }

//           .leave-layout-wrapper { 
//             display: flex; 
//             flex-direction: column; 
//             gap: 20px; 
//             width: 100%; 
//             max-width: 1200px; /* Constraints stay here */
//             padding-left: 20px; 
//           }

//           .balance-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; }
//           .leave-main-grid { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: stretch; width: 100%; }
          
//           .glass-panel { background: var(--glass); border-radius: 20px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; overflow: hidden; }
          
//           .form-container { padding: 25px; height: 450px; }
//           .history-container { height: 450px; min-width: 0; /* Prevents grid blowout */ }

//           .filter-bar { 
//             display: grid; 
//             grid-template-columns: 1.2fr 1.2fr 0.6fr; 
//             gap: 10px; 
//             padding: 12px; 
//             background: rgba(0,0,0,0.2); 
//             border-bottom: 1px solid var(--glass-border);
//             margin: 0 15px 10px 15px;
//             border-radius: 10px;
//           }
//           .filter-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; font-size: 12px; outline: none; }

//           .scroll-list { flex: 1; overflow-y: auto; padding: 0 15px 15px 15px; }
//           .scroll-list::-webkit-scrollbar { width: 6px; }
//           .scroll-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

//           .history-item { display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px; border: 1px solid transparent; transition: 0.3s; }
//           .history-item:hover { border-color: var(--accent-soft); background: rgba(255,255,255,0.06); }
          
//           .date-range-box { min-width: 100px; border-right: 1px solid rgba(255,255,255,0.1); margin-right: 15px; display: flex; flex-direction: column; }
//           .date-sub { font-size: 9px; opacity: 0.5; text-transform: uppercase; }
//           .date-val { font-size: 12px; font-weight: bold; color: var(--accent); }

//           .leave-desc { font-size: 11px; opacity: 0.6; margin-top: 4px; font-style: italic; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
//           .status-pill.small { padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 6px; text-transform: uppercase; margin-left: auto; }
//         `}
//       </style>

//       <div className="leave-layout-wrapper">
//         <div className="balance-strip">
//           {Object.keys(limits).map((cat) => (
//             <div className="mini-balance-card" key={cat} style={{ background: "var(--glass)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px solid var(--glass-border)" }}>
//               <span style={{ fontSize: "11px", opacity: 0.6, textTransform: "uppercase" }}>{cat} Remaining</span>
//               <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "5px" }}>
//                 {limits[cat] - history.filter((h) => h.category === cat && h.status === "Approved").reduce((s, r) => s + r.duration, 0)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="leave-main-grid">
//           <div className="glass-panel form-container">
//             <h3 style={{ marginBottom: "15px" }}>New Request</h3>
//             <div className="form-group">
//               <label className="timestamp-label">Category</label>
//               <select className="custom-select" value={leave.category} onChange={(e) => setLeave({ ...leave, category: e.target.value })}>
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Medical">Medical Leave</option>
//                 <option value="Emergency">Emergency Leave</option>
//               </select>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
//               <div className="form-group">
//                 <label className="timestamp-label">Start Date</label>
//                 <input type="date" className="glass-input" value={leave.startDate} onChange={(e) => setLeave({ ...leave, startDate: e.target.value })} />
//               </div>
//               <div className="form-group">
//                 <label className="timestamp-label">End Date</label>
//                 <input type="date" className="glass-input" value={leave.endDate} onChange={(e) => setLeave({ ...leave, endDate: e.target.value })} />
//               </div>
//             </div>
//             <div className="form-group" style={{ marginTop: "15px", flex: 1 }}>
//               <label className="timestamp-label">Reason</label>
//               <textarea className="glass-input" rows="3" placeholder="Explain your leave..." style={{ resize: "none" }} value={leave.reason} onChange={(e) => setLeave({ ...leave, reason: e.target.value })} />
//             </div>
//             <button className="action-btn" onClick={submitLeave} style={{ width: "100%", marginTop: "15px", padding: "12px" }}>Submit Request</button>
//           </div>

//           <div className="glass-panel history-container">
//             <h4 style={{ margin: "20px 0 10px 20px", fontSize: "14px", opacity: 0.8 }}>Leave History</h4>
//             <div className="filter-bar">
//               <input type="date" className="filter-input" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
//               <select className="filter-input" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
//                 <option value="All">All Categories</option>
//                 <option value="Casual">Casual</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Emergency">Emergency</option>
//               </select>
//               <input type="number" placeholder="Days" className="filter-input" onChange={(e) => setFilters({ ...filters, days: e.target.value })} />
//             </div>

//             <div className="scroll-list">
//               {filteredHistory.length > 0 ? (
//                 filteredHistory.map((h) => (
//                   <div className="history-item" key={h._id}>
//                     <div className="date-range-box">
//                       <span className="date-sub">From</span>
//                       <span className="date-val">{new Date(h.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                       <span className="date-sub" style={{marginTop: '4px'}}>To</span>
//                       <span className="date-val">{new Date(h.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: "13px", fontWeight: "600" }}>
//                         {h.category} • <span style={{ opacity: 0.7, fontWeight: "400" }}>{h.duration} Days</span>
//                       </div>
//                       <div className="leave-desc" title={h.reason}>{h.reason || "No description"}</div>
//                     </div>
//                     <span className={`status-pill small ${h.status.toLowerCase()}`}>{h.status}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.3, fontSize: '13px' }}>No records found</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- LEAVE CENTER (SCROLLBAR ELIMINATED) ---------------- */

// function LeaveCenter({ token, showToast }) {
//   const [history, setHistory] = useState([]);
//   const [filters, setFilters] = useState({ date: "", category: "All", days: "" });
//   const [leave, setLeave] = useState({ startDate: "", endDate: "", category: "Casual", reason: "" });

//   const limits = { Casual: 15, Medical: 10, Emergency: 5 };

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employee/leave-history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, [token]);

//   const calculateDays = (start, end) => {
//     if (!start || !end) return 0;
//     const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
//     return diff > 0 ? diff : 0;
//   };

//   const filteredHistory = useMemo(() => {
//     return history
//       .filter(h => {
//         const matchDate = filters.date ? h.startDate.includes(filters.date) : true;
//         const matchCat = filters.category !== "All" ? h.category === filters.category : true;
//         const matchDays = filters.days ? h.duration === parseInt(filters.days) : true;
//         return matchDate && matchCat && matchDays;
//       })
//       .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)); 
//   }, [history, filters]);

//   const submitLeave = async () => {
//     const duration = calculateDays(leave.startDate, leave.endDate);
//     if (duration <= 0) return showToast("Invalid date range", "error");
//     try {
//       await axios.post(`${API_URL}/employee/leave`, { ...leave, duration }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast("Requested Successfully", "success");
//       setLeave({ startDate: "", endDate: "", category: "Casual", reason: "" });
//       fetchData();
//     } catch (e) { showToast("Submission failed", "error"); }
//   };

//   return (
//     <section className="page-content" style={{ overflow: "hidden", width: "100%" }}>
//       <style>
//         {`
//           .leave-layout-wrapper { 
//             display: flex; 
//             flex-direction: column; 
//             gap: 20px; 
//             /* Use margin instead of padding for the left offset to avoid width bloat */
//             margin: 20px 20px 20px 0;
//             max-width: calc(100% - 40px);
//             box-sizing: border-box;
//           }

//           .balance-strip { 
//             display: grid; 
//             grid-template-columns: repeat(3, 1fr); 
//             gap: 15px; 
//           }

//           .leave-main-grid { 
//             display: grid; 
//             /* Changed 1fr to minmax to prevent overflow */
//             grid-template-columns: 380px minmax(0, 1fr); 
//             gap: 20px; 
//             align-items: stretch;
//           }
          
//           .glass-panel { 
//             background: var(--glass); 
//             border-radius: 20px; 
//             border: 1px solid var(--glass-border); 
//             display: flex; 
//             flex-direction: column; 
//             overflow: hidden; 
//             box-sizing: border-box;
//           }
          
//           .form-container { padding: 25px; height: 450px; }
//           .history-container { height: 450px; }

//           .filter-bar { 
//             display: grid; 
//             grid-template-columns: 1.2fr 1.2fr 1.2fr; 
//             gap: 35px; 
//             padding: 12px; 
//             background: rgba(0,0,0,0.2); 
//             border-bottom: 1px solid var(--glass-border);
//             margin: 0 15px 10px 15px;
//             border-radius: 10px;
//           }

//           .filter-input { 
//             background: rgba(255,255,255,0.05); 
//             border: 1px solid rgba(255,255,255,0.1); 
//             color: white; 
//             border-radius: 8px; 
//             padding: 4px; 
//             font-size: 12px; 
//             outline: none; 
//             width: 95%;
//           }

//           .scroll-list { flex: 1; overflow-y: auto; padding: 0 15px 15px 15px; }
//           .scroll-list::-webkit-scrollbar { width: 6px; }
//           .scroll-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

//           .history-item { 
//             display: flex; 
//             align-items: center; 
//             padding: 15px; 
//             background: rgba(255,255,255,0.03); 
//             border-radius: 12px; 
//             margin-bottom: 10px; 
//             border: 1px solid transparent; 
//             transition: 0.3s; 
//           }
//           .history-item:hover { border-color: var(--accent-soft); background: rgba(255,255,255,0.06); }
          
//           .date-range-box { min-width: 100px; border-right: 1px solid rgba(255,255,255,0.1); margin-right: 15px; display: flex; flex-direction: column; }
//           .date-sub { font-size: 9px; opacity: 0.5; text-transform: uppercase; }
//           .date-val { font-size: 12px; font-weight: bold; color: var(--accent); }

//           .leave-desc { 
//             font-size: 11px; 
//             opacity: 0.6; 
//             margin-top: 4px; 
//             font-style: italic; 
//             display: -webkit-box; 
//             -webkit-line-clamp: 1; 
//             -webkit-box-orient: vertical; 
//             overflow: hidden; 
//           }
//           .status-pill.small { padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 6px; text-transform: uppercase; margin-left: auto; }
//         `}
//       </style>

//       <div className="leave-layout-wrapper">
//         <div className="balance-strip">
//           {Object.keys(limits).map((cat) => (
//             <div className="mini-balance-card" key={cat} style={{ background: "var(--glass)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px solid var(--glass-border)" }}>
//               <span style={{ fontSize: "11px", opacity: 0.6, textTransform: "uppercase" }}>{cat} Remaining</span>
//               <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "5px" }}>
//                 {limits[cat] - history.filter((h) => h.category === cat && h.status === "Approved").reduce((s, r) => s + r.duration, 0)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="leave-main-grid">
//           <div className="glass-panel form-container">
//             <h3 style={{ marginBottom: "15px" }}>New Request</h3>
//             <div className="form-group">
//               <label className="timestamp-label">Category</label>
//               <select className="custom-select" value={leave.category} onChange={(e) => setLeave({ ...leave, category: e.target.value })}>
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Medical">Medical Leave</option>
//                 <option value="Emergency">Emergency Leave</option>
//               </select>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
//               <div className="form-group">
//                 <label className="timestamp-label">Start Date</label>
//                 <input type="date" className="glass-input" value={leave.startDate} onChange={(e) => setLeave({ ...leave, startDate: e.target.value })} />
//               </div>
//               <div className="form-group">
//                 <label className="timestamp-label">End Date</label>
//                 <input type="date" className="glass-input" value={leave.endDate} onChange={(e) => setLeave({ ...leave, endDate: e.target.value })} />
//               </div>
//             </div>
//             <div className="form-group" style={{ marginTop: "15px", flex: 1 }}>
//               <label className="timestamp-label">Reason</label>
//               <textarea className="glass-input" rows="3" placeholder="Explain your leave..." style={{ resize: "none" }} value={leave.reason} onChange={(e) => setLeave({ ...leave, reason: e.target.value })} />
//             </div>
//             <button className="action-btn" onClick={submitLeave} style={{ width: "100%", marginTop: "15px", padding: "12px" }}>Submit Request</button>
//           </div>

//           <div className="glass-panel history-container">
//             <h4 style={{ margin: "20px 0 10px 20px", fontSize: "14px", opacity: 0.8 }}>Leave History</h4>
//             <div className="filter-bar">
//               <input type="date" className="filter-input" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
//               <select className="filter-input" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
//                 <option value="All">All Categories</option>
//                 <option value="Casual">Casual</option>
//                 <option value="Medical">Medical</option>
//                 <option value="Emergency">Emergency</option>
//               </select>
//               <input type="number" placeholder="Days" className="filter-input" onChange={(e) => setFilters({ ...filters, days: e.target.value })} />
//             </div>

//             <div className="scroll-list">
//               {filteredHistory.length > 0 ? (
//                 filteredHistory.map((h) => (
//                   <div className="history-item" key={h._id}>
//                     <div className="date-range-box">
//                       <span className="date-sub">From</span>
//                       <span className="date-val">{new Date(h.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                       <span className="date-sub" style={{marginTop: '4px'}}>To</span>
//                       <span className="date-val">{new Date(h.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: "13px", fontWeight: "600" }}>
//                         {h.category} • <span style={{ opacity: 0.7, fontWeight: "400" }}>{h.duration} Days</span>
//                       </div>
//                       <div className="leave-desc" title={h.reason}>{h.reason || "No description"}</div>
//                     </div>
//                     <span className={`status-pill small ${h.status.toLowerCase()}`}>{h.status}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.3, fontSize: '13px' }}>No records found</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }