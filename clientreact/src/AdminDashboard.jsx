
import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./App.css";
import { MdAddTask } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { io } from "socket.io-client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Radar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import {
  Users,
  Check,
  ArrowRight,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  Home,
  MessageSquare,
  Folder,
  Clock,
  FileText,
  LogOut,
  TrendingUp,
  Activity, // Used in the Node cards
  Cpu, // Used in the Provisioning box
  Target, // <--- Add this
  Calendar, // <--- Add this (used for the deadline field)
  Zap,
} from "lucide-react";

import Dashboard from "./Dashboard";
import TaskCenter from "./TaskCenter";
import LeaveCenter from "./LeaveCenter";
import AttendanceTab from "./AttendanceTab";
import EODReportTab from "./EODReportTab";
import ChatDrawer from "./ChatDrawer";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Tooltip,
  Legend,
);

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

export default function AdminDashboard({ token, user, showToast, logout }) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  // FIX: Initialize from localStorage first, then user prop, then default to "Available"
  // This prevents the "flash" or reset to Available on refresh.
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

  // SYNC PULSE STATUS
  useEffect(() => {
    // We skip the very first run so we don't overwrite the DB with initial state on refresh
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const updatePulseInDB = async () => {
      try {
        // Save to localStorage immediately so refresh is handled even if API is slow
        localStorage.setItem(`pulse_${user?.id}`, pulse);

        await axios.patch(
          `${API_URL}/admin/update-pulse`,
          { pulseStatus: pulse },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (err) {
        console.error("Failed to sync pulse status:", err);
      }
    };

    updatePulseInDB();
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
    if (attendance?.checkInTime && !attendance?.checkOutTime) {
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
            ADMIN
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
            <Clock size={18} /> My Attendance
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
          <div className="admin-nav">
            <p
              className="nav-label"
              style={{
                fontSize: "10px",
                opacity: 0.6,
                margin: "15px 0 5px 10px",
              }}>
              CONTROL ROOM
            </p>
            <button
              onClick={() => setCurrentPage("admin-workforce")}
              className={`nav-link ${currentPage === "admin-workforce" ? "active" : ""}`}>
              <Users size={18} /> Workforce
            </button>
            <button
              onClick={() => setCurrentPage("admin-assign-task")}
              className={`nav-link ${currentPage === "admin-assign-task" ? "active" : ""}`}>
              <Target size={18} /> Task Dispatcher
            </button>
            <button
              onClick={() => setCurrentPage("admin-tasks")}
              className={`nav-link ${currentPage === "admin-tasks" ? "active" : ""}`}>
              <MdAddTask size={18} /> Task Monitor
            </button>
            <button
              onClick={() => setCurrentPage("admin-approvals")}
              className={`nav-link ${currentPage === "admin-approvals" ? "active" : ""}`}>
              <TfiWrite size={18} /> Approvals
            </button>
          </div>
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
                : currentPage.charAt(0).toUpperCase() +
                  currentPage.slice(1).replace("-", " ")}
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
              className={`action-btn ${attendance?.checkInTime && !attendance?.checkOutTime ? "btn-checkout" : "btn-checkin"}`}
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
        {currentPage === "admin-workforce" && (
          <AdminWorkforce token={token} showToast={showToast} />
        )}
        {currentPage === "admin-assign-task" && (
          <AdminTaskAssigner token={token} showToast={showToast} />
        )}
        {currentPage === "admin-tasks" && <AdminTaskMonitor token={token} />}
        {currentPage === "admin-approvals" && (
          <Approvals token={token} showToast={showToast} />
        )}
      </main>
    </>
  );
}


/* ---------------- 1. ADMIN WORKFORCE (Infrastructure & Node Provisioning) ---------------- */
function AdminWorkforce({ token, showToast }) {
  const [data, setData] = useState({ employees: [], totalSalaryBurn: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [addForm, setAddForm] = useState({
    name: "", email: "", role: "Employee", department: "Cloud",
    password: "Password123", lead_id: "", manager_id: "",
  });

  const fetchWorkforce = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchWorkforce(); }, [token]);

  // Handle Filtering Logic
  const filteredEmployees = data.employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    const matchesRole = roleFilter === "All" || emp.role === roleFilter;
    
    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddEmployee = async () => {
    if (!addForm.name || !addForm.email) return showToast("Fields required", "error");
    try {
      await axios.post(`${API_URL}/admin/add-employee`, addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Node Provisioned Successfully", "success");
      setAddForm({ name: "", email: "", role: "Employee", department: "Cloud", password: "Password123", lead_id: "", manager_id: "" });
      setShowAddForm(false);
      fetchWorkforce();
    } catch (e) { showToast("Provisioning failed", "error"); }
  };

  const filteredLeads = data.employees.filter(emp => emp.department === addForm.department && emp.role === "Lead");
  const filteredManagers = data.employees.filter(emp => emp.department === addForm.department && emp.role === "Manager");

  return (
    <section className="page-content" style={{ animation: "fadeIn 0.5s ease" }}>
      <div className="intelligence-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        
        {/* Left Col: Node Directory */}
        <div className="col left glass" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="mini-label" style={{ color: 'var(--accent)', margin: 0 }}>ACTIVE INFRASTRUCTURE NODES</span>
            <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{filteredEmployees.length} / {data.employees.length} VISIBLE</span>
          </div>

          {/* --- FILTER BAR --- */}
          <div className="filter-bar" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '10px', alignItems: 'center' }}>
             <input 
                className="glass-input" 
                placeholder="Search by name or email..." 
                style={{ flex: 2, fontSize: '0.8rem', padding: '8px 12px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <select 
                className="custom-select" 
                style={{ flex: 1, fontSize: '0.75rem', height: '35px' }}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
             >
                <option value="All">All Departments</option>
                {["Cloud", "Development", "Design", "Security", "QA"].map(d => <option key={d} value={d}>{d}</option>)}
             </select>
             <select 
                className="custom-select" 
                style={{ flex: 1, fontSize: '0.75rem', height: '35px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
             >
                <option value="All">All Roles</option>
                {["Employee", "Lead", "Manager", "Admin"].map(r => <option key={r} value={r}>{r}</option>)}
             </select>
          </div>

          <div className="feed-scroll" style={{ maxHeight: "65vh", overflowY: 'auto', padding: '15px', display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "15px" }}>
            {filteredEmployees.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.3, padding: '40px' }}>
                <ShieldAlert size={32} style={{ marginBottom: '10px' }} /><br/>
                No nodes match the current filter criteria.
              </div>
            ) : (
              filteredEmployees.map(e => (
                <div key={e._id} className="glass card" style={{ borderLeft: `3px solid var(--accent)`, padding: '15px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <div className="stat-icon-circle" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', width: '32px', height: '32px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {e.name.charAt(0)}
                     </div>
                     <span className="status-pill" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{e.role}</span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#fff' }}>{e.name}</strong>
                    <small style={{ display: 'block', opacity: 0.5, marginBottom: '8px' }}>{e.email}</small>
                    <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold' }}>{e.department?.toUpperCase()}</span>
                      <Activity size={12} style={{ opacity: 0.3 }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Controls & Provisioning */}
        <div className="col right glass" style={{ padding: '20px' }}>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <span className="mini-label">COMMAND & CONTROL</span>
          </div>
          
          <div className="burn-graph glass" style={{ marginBottom: '20px', padding: '15px' }}>
            <div className="mini-label">ANNUAL OPERATIONAL BURN</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--success)' }}>${data.totalSalaryBurn?.toLocaleString()}</div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
            </div>
          </div>

          <button className="action-btn" style={{ width: '100%', marginBottom: '20px', padding: '12px', fontWeight: 'bold' }} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "ABORT PROVISIONING" : "PROVISION NEW NODE"}
          </button>

          {showAddForm && (
            <div className="ai-insight-box" style={{ background: 'rgba(55, 66, 250, 0.08)', border: '1px solid var(--accent-soft)', borderRadius: '12px', padding: '15px', animation: 'slideIn 0.3s ease' }}>
              <div className="ai-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '15px' }}>
                <Cpu size={14}/> NODE PARAMETERS
              </div>
              
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="mini-label">FULL NAME</label>
                <input className="glass-input" style={{ width: '100%' }} value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} />
              </div>
              
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="mini-label">EMAIL ADDRESS</label>
                <input className="glass-input" style={{ width: '100%' }} value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="mini-label">DEPARTMENT</label>
                  <select className="custom-select" style={{ width: '100%' }} value={addForm.department} onChange={e => setAddForm({...addForm, department: e.target.value, lead_id: "", manager_id: ""})}>
                    {["Cloud", "Development", "Design", "Security", "QA"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="mini-label">ROLE</label>
                  <select className="custom-select" style={{ width: '100%' }} value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})}>
                    {["Employee", "Lead", "Manager", "Admin"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {addForm.role === "Employee" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="mini-label">LEAD</label>
                    <select className="custom-select" style={{ width: '100%' }} value={addForm.lead_id} onChange={e => setAddForm({...addForm, lead_id: e.target.value})}>
                      <option value="">Select</option>
                      {filteredLeads.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="mini-label">MANAGER</label>
                    <select className="custom-select" style={{ width: '100%' }} value={addForm.manager_id} onChange={e => setAddForm({...addForm, manager_id: e.target.value})}>
                      <option value="">Select</option>
                      {filteredManagers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
              )}
              
              <button className="action-btn" onClick={handleAddEmployee} style={{ width: '100%', marginTop: '10px', background: 'var(--accent)', color: '#000', border: 'none' }}>
                INITIATE PROVISIONING
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}




/* ---------------- 2. ADMIN TASK ASSIGNER (The Workflow Tab) ---------------- */
function AdminTaskAssigner({ token, showToast }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loadFilter, setLoadFilter] = useState("All");

  const [modal, setModal] = useState({ 
    show: false, 
    empId: "", 
    empName: "", 
    title: "", 
    deadline: "" 
  });

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data.employees || []);
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchEmp();
  }, [token]);

  // Combined Filtering Logic
  const filteredEmployees = employees.filter(e => {
    const activeTasks = e.performance?.assignedTasks?.filter(t => t.status !== 'Completed').length || 0;
    
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    const matchesRole = roleFilter === "All" || e.role === roleFilter;
    
    let matchesLoad = true;
    if (loadFilter === "Ready") matchesLoad = activeTasks === 0;
    if (loadFilter === "Busy") matchesLoad = activeTasks > 0 && activeTasks < 4;
    if (loadFilter === "Overloaded") matchesLoad = activeTasks >= 4;

    return matchesSearch && matchesDept && matchesRole && matchesLoad;
  });

  const assignTask = async () => {
    if (!modal.title || !modal.deadline) return showToast("Fields required", "error");
    try {
      await axios.post(`${API_URL}/admin/assign-task`, {
        employeeId: modal.empId, 
        title: modal.title, 
        deadline: modal.deadline,
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      showToast("Task Deployed Successfully!", "success");
      setModal({ show: false, empId: "", empName: "", title: "", deadline: "" });
    } catch (e) { 
      showToast("Deployment failed", "error"); 
    }
  };

  return (
    <section className="page-content" style={{ animation: "fadeIn 0.5s ease" }}>
      <div className="intelligence-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        
        {/* Left Col: Target Selection */}
        <div className="col left glass" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
            <span className="mini-label" style={{ color: 'var(--accent)', margin: 0 }}>SELECT DEPLOYMENT TARGET</span>
            <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{filteredEmployees.length} NODES MATCHING</span>
          </div>

          {/* --- FILTER INTERFACE --- */}
          <div className="filter-bar" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '10px' }}>
             <input 
                className="glass-input" 
                placeholder="Search Node Name..." 
                style={{ fontSize: '0.75rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <select className="custom-select" style={{ fontSize: '0.7rem' }} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="All">All Depts</option>
                {["Cloud", "Development", "Design", "Security", "QA"].map(d => <option key={d} value={d}>{d}</option>)}
             </select>
             <select className="custom-select" style={{ fontSize: '0.7rem' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="All">All Roles</option>
                {["Employee", "Lead", "Manager"].map(r => <option key={r} value={r}>{r}</option>)}
             </select>
             <select className="custom-select" style={{ fontSize: '0.7rem' }} value={loadFilter} onChange={(e) => setLoadFilter(e.target.value)}>
                <option value="All">Any Load</option>
                <option value="Ready">Ready (0)</option>
                <option value="Busy">Busy (1-3)</option>
                <option value="Overloaded">Overloaded (4+)</option>
             </select>
          </div>

          <div className="feed-scroll" style={{ maxHeight: "65vh", overflowY: 'auto', padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {filteredEmployees.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.3, padding: '60px' }}>
                <ShieldAlert size={40} style={{ marginBottom: '15px' }}/>
                <p>No deployment targets found matching these parameters.</p>
              </div>
            ) : (
              filteredEmployees.map(e => {
                const activeTasks = e.performance?.assignedTasks?.filter(t => t.status !== 'Completed').length || 0;
                const isSelected = modal.empId === e._id;

                return (
                  <div 
                    key={e._id} 
                    className={`glass card ${isSelected ? 'active-border' : ''}`} 
                    style={{ 
                      cursor: 'pointer', 
                      padding: '15px', 
                      transition: 'all 0.3s ease',
                      borderLeft: isSelected ? `4px solid var(--accent)` : `4px solid rgba(255,255,255,0.1)`
                    }} 
                    onClick={() => setModal({ ...modal, show: true, empId: e._id, empName: e.name })}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div className="stat-icon-circle" style={{ 
                          background: isSelected ? 'var(--accent)' : 'var(--accent-soft)', 
                          color: isSelected ? '#000' : 'var(--accent)', 
                          width: '32px', height: '32px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' 
                        }}>
                          {e.name.charAt(0)}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{e.name}</strong>
                          <small style={{ fontSize: '0.7rem' }}>{e.role}</small>
                        </div>
                      </div>
                      <ArrowRight size={14} style={{ opacity: isSelected ? 1 : 0.2, color: isSelected ? 'var(--accent)' : '#fff' }}/>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span className="mini-label" style={{ fontSize: '9px' }}>Current Load</span>
                        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{activeTasks} Tasks</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min(activeTasks * 25, 100)}%`, 
                          height: '100%', 
                          background: activeTasks > 4 ? 'var(--danger)' : activeTasks > 2 ? 'var(--warning)' : 'var(--success)',
                          transition: 'width 0.5s ease'
                        }}></div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>{e.department}</span>
                      {activeTasks === 0 && <span style={{ fontSize: '9px', color: 'var(--success)', fontWeight: 'bold' }}>READY FOR DISPATCH</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Dispatcher Panel */}
        <div className="col right glass" style={{ padding: '20px' }}>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <span className="mini-label">TASK DISPATCHER</span>
          </div>

          {modal.show ? (
            <div style={{ animation: 'slideIn 0.3s ease' }}>
              <div className="ai-insight-box" style={{ background: 'rgba(0, 242, 254, 0.03)', border: '1px solid var(--accent-soft)', borderRadius: '12px', padding: '20px' }}>
                <div className="ai-head" style={{ color: 'var(--accent)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={16}/> 
                  <span style={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>TARGET: {modal.empName.toUpperCase()}</span>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="mini-label"><Target size={10} style={{marginRight: '5px'}}/> OBJECTIVE</label>
                  <input 
                    className="glass-input" 
                    placeholder="Describe mission objective..." 
                    value={modal.title}
                    style={{ width: '100%', marginTop: '5px' }}
                    onChange={e => setModal({...modal, title: e.target.value})} 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="mini-label"><Calendar size={10} style={{marginRight: '5px'}}/> DEADLINE (UTC)</label>
                  <input 
                    type="datetime-local" 
                    className="glass-input" 
                    style={{ width: '100%', marginTop: '5px' }}
                    onChange={e => setModal({...modal, deadline: e.target.value})} 
                  />
                </div>

                <button 
                  className="action-btn" 
                  style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
                  onClick={assignTask}
                >
                  <Zap size={16} fill="black"/> DEPLOY TASK
                </button>
                
                <button 
                  className="action-btn-mini" 
                  style={{ width: '100%', marginTop: '10px', padding: '10px', opacity: 0.6 }} 
                  onClick={() => setModal({ ...modal, show: false, empId: "", empName: "", title: "", deadline: "" })}
                >
                  ABORT DISPATCH
                </button>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: 0, lineHeight: '1.4' }}>
                  <ShieldAlert size={12} style={{ verticalAlign: 'middle', marginRight: '5px' }}/>
                  Task deployment will be logged in the system audit trail and the target node will receive an instant notification.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.3 }}>
              <BrainCircuit size={48} style={{ marginBottom: '20px', color: 'var(--accent)' }}/>
              <p className="mini-label" style={{ fontSize: '11px' }}>Waiting for Target Selection</p>
              <p style={{ fontSize: '0.8rem' }}>Select a node from the directory to initialize the task dispatch protocol.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- COMMAND CENTER: TASK MONITOR ---------------- */

function AdminTaskMonitor({ token }) {
  const [allTasks, setAllTasks] = useState([]);
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const roles = ["All", "Employee", "Lead", "Manager", "Admin"];
  const statuses = ["All", "Pending", "Planning", "Processing", "Completed"];

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employees = res.data.employees || [];
      const flatTasks = [];
      employees.forEach((emp) => {
        if (emp.performance?.assignedTasks) {
          emp.performance.assignedTasks.forEach((task) => {
            flatTasks.push({ ...task, employeeName: emp.name, role: emp.role || "Employee" });
          });
        }
      });
      setAllTasks(flatTasks);
    } catch (e) {
      console.error("Task Monitor Fetch Error", e);
    }
  };

  useEffect(() => {
    fetchAllTasks();
    const interval = setInterval(fetchAllTasks, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredTasks = allTasks.filter((t) => {
    const roleMatch = filterRole === "All" || t.role.toLowerCase() === filterRole.toLowerCase();
    const statusMatch = filterStatus === "All" || t.status.toLowerCase() === filterStatus.toLowerCase();
    return roleMatch && statusMatch;
  });

  // Calculate Chart Data
  const stats = {
    Processing: filteredTasks.filter(t => t.status === "Processing").length,
    Planning: filteredTasks.filter(t => t.status === "Planning").length,
    Completed: filteredTasks.filter(t => t.status === "Completed").length,
    Pending: filteredTasks.filter(t => t.status === "Pending").length,
    Overdue: filteredTasks.filter(t => t.status !== "Completed" && new Date(t.deadline) < new Date()).length,
  };

  const chartData = {
    labels: Object.keys(stats),
    datasets: [{
      data: Object.values(stats),
      backgroundColor: [
        "rgba(55, 66, 250, 1)", // Processing (accent)
        "#a29bfe",              // Planning
        "#2ed573",              // Completed (success)
        "#ffa502",              // Pending (warning)
        "#ff4757",              // Overdue (danger)
      ],
      borderWidth: 0,
      hoverOffset: 15,
    }],
  };

  const chartOptions = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        displayColors: false
      }
    },
    maintainAspectRatio: false,
  };

  // Center Text Plugin
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      ctx.font = "bold 2rem sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      const text = filteredTasks.length.toString();
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      
      ctx.font = "0.7rem sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      const subText = "TOTAL NODES";
      const subX = Math.round((width - ctx.measureText(subText).width) / 2);
      ctx.fillText(subText, subX, textY + 25);
      ctx.save();
    }
  };

  const calculateTotalTime = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status, deadline) => {
    if (status === "Completed") return "var(--success)";
    if (new Date(deadline) < new Date() && status !== "Completed") return "var(--danger)";
    if (status === "Processing") return "var(--accent)";
    if (status === "Planning") return "#a29bfe";
    return "var(--warning)";
  };

  return (
    <section className="page-content" style={{ animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        
        <div style={{ flex: 1 }}>
          <div className="filter-container" style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", opacity: 0.6, marginBottom: "8px", fontWeight: 700 }}>INFRASTRUCTURE ROLE</p>
            <div className="status-toggle-group" style={{ position: "relative", left: "0", transform: "none", display: "inline-flex" }}>
              {roles.map((role) => (
                <button key={role} onClick={() => setFilterRole(role)} className={`status-mini-btn ${filterRole === role ? "active-green" : ""}`}>{role}</button>
              ))}
            </div>
          </div>

          <div className="filter-container" style={{ marginBottom: "30px" }}>
            <p style={{ fontSize: "11px", opacity: 0.6, marginBottom: "8px", fontWeight: 700 }}>NODE STATUS</p>
            <div className="status-toggle-group" style={{ position: "relative", left: "0", transform: "none", display: "inline-flex", background: "rgba(255,255,255,0.02)" }}>
              {statuses.map((status) => (
                <button key={status} onClick={() => setFilterStatus(status)} style={{ fontSize: "10px", padding: "4px 10px" }} className={`status-mini-btn ${filterStatus === status ? "active-orange" : ""}`}>{status}</button>
              ))}
            </div>
          </div>

          <div className="task-grid-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", transition: "all 0.4s ease-in-out" }}>
            {filteredTasks.map((t) => (
              <div key={t._id} className="glass card" style={{ borderLeft: `4px solid ${getStatusColor(t.status, t.deadline)}`, display: "flex", flexDirection: "column", gap: "12px", animation: "slideIn 0.3s ease-out" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: "1rem", color: "white" }}>{t.title}</h3>
                  <div className="user-avatar-small" style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "1px solid var(--accent)" }}>
                    {t.employeeName.charAt(0)}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                  <p style={{ margin: "2px 0" }}>👤 <strong>{t.employeeName}</strong> <span style={{ opacity: 0.5 }}>({t.role})</span></p>
                  <p style={{ margin: "2px 0" }}>📅 Assigned: {new Date(t.assignedAt).toLocaleDateString()}</p>
                  <p style={{ margin: "2px 0" }}>⏳ Due: {new Date(t.deadline).toLocaleDateString()}</p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={`status-pill ${t.status.toLowerCase()}`}>{t.status}</span>
                  {t.status === "Completed" ? (
                    <div style={{ textAlign: "right" }}>
                       <span className="time-badge" style={{ background: "var(--success)", color: "black", fontWeight: "bold" }}>⚡ {calculateTotalTime(t.assignedAt, t.completedAt)}</span>
                    </div>
                  ) : (
                    <span className="time-badge">{Math.floor((new Date() - new Date(t.assignedAt)) / 3600000)}h elapsed</span>
                  )}
                </div>
                {t.status === "Completed" && <small style={{ fontSize: "9px", textAlign: "right", marginTop: "-8px", opacity: 0.5 }}>Resolved at: {new Date(t.completedAt).toLocaleTimeString()}</small>}
              </div>
            ))}
            {filteredTasks.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", opacity: 0.5 }}>No nodes found.</div>}
          </div>
        </div>

        {/* INTERACTIVE SIDEBAR */}
        <div className="glass card" style={{ width: "300px", position: "sticky", top: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ color: "var(--accent)", fontSize: "0.9rem", letterSpacing: "1px" }}>SYSTEM VELOCITY</h3>
            <p style={{ fontSize: "0.7rem", opacity: 0.5 }}>Real-time node distribution</p>
          </div>

          <div style={{ height: "200px", position: "relative" }}>
            <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
          </div>

          <div className="legend-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {Object.entries(stats).map(([label, count], i) => (
              <div 
                key={label} 
                style={{ 
                  padding: "8px", 
                  background: "rgba(255,255,255,0.03)", 
                  borderRadius: "6px", 
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.2s ease"
                }}
                className="legend-item"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: chartData.datasets[0].backgroundColor[i] }}></div>
                  <span style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-dim)" }}>{label.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{count}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "10px", padding: "12px", background: stats.Overdue > 0 ? "rgba(255,71,87,0.1)" : "rgba(46,213,115,0.1)", borderRadius: "10px", border: `1px solid ${stats.Overdue > 0 ? "rgba(255,71,87,0.2)" : "rgba(46,213,115,0.2)"}` }}>
            <p style={{ color: stats.Overdue > 0 ? "var(--danger)" : "var(--success)", fontSize: "0.75rem", margin: 0 }}>
              {stats.Overdue > 0 
                ? `Critical: ${stats.Overdue} nodes require immediate resolution to maintain velocity.`
                : "System stable. All active nodes within deadline parameters."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}


/* ---------------- 4. APPROVALS (Request Management Hub) ---------------- */
function Approvals({ token, showToast }) {
  const [reqs, setReqs] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState("Pending");
  
  // Custom Revocation Modal state
  const [revokeModal, setRevokeModal] = useState({ show: false, id: "" });
  const [revokeReason, setRevokeReason] = useState("");

  const fetchReqs = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/leave-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReqs(res.data);
      if (!selectedReq && res.data.length > 0) {
        const pending = res.data.find(r => r.status === "Pending");
        setSelectedReq(pending || res.data[0]);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchReqs(); }, [token]);

  const executeStatusUpdate = async (id, status, reason, currentStatus) => {
    try {
      const finalStatus = currentStatus === "Approved" && status === "Rejected" ? "Revoked" : status;
      await axios.patch(`${API_URL}/admin/leave-status/${id}`,
        { status: finalStatus, rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(`Node Status: ${finalStatus}`, "success");
      setRejectionReason("");
      setRevokeReason("");
      setRevokeModal({ show: false, id: "" });
      setSelectedReq(null);
      fetchReqs();
    } catch (e) {
      showToast(e.response?.data?.error || "Update failed", "error");
    }
  };

  const getCategoryIcon = (cat) => {
    if (cat?.toLowerCase().includes("sick") || cat?.toLowerCase().includes("medical")) {
        return <Activity size={14} style={{ color: 'var(--danger)' }}/>;
    }
    if (cat?.toLowerCase().includes("vacation")) {
        return <Target size={14} style={{ color: 'var(--accent)' }}/>;
    }
    return <Calendar size={14} style={{ color: 'var(--success)' }}/>;
  };

  const filteredReqs = reqs.filter(r => filter === "All" || r.status === filter);

  return (
    <section className="page-content" style={{ animation: "fadeIn 0.5s ease" }}>
      <div
        className="intelligence-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "20px",
        }}>
        {/* LEFT: Feed Pipeline */}
        <div
          className="col left glass"
          style={{ display: "flex", flexDirection: "column" }}>
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px",
            }}>
            <span
              className="mini-label"
              style={{ color: "var(--accent)", margin: 0 }}>
              LEAVE PIPELINE
            </span>
            <div
              className="status-toggle-group"
              style={{ display: "flex", gap: "5px" }}>
              {["Pending", "Approved", "Rejected", "All"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`status-mini-btn ${filter === s ? "active-green" : ""}`}
                  style={{
                    fontSize: "9px",
                    padding: "4px 8px",
                    textTransform: "uppercase",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div
            className="feed-scroll"
            style={{ maxHeight: "70vh", overflowY: "auto", padding: "15px" }}>
            {filteredReqs.length === 0 ? (
              <div
                style={{ textAlign: "center", opacity: 0.3, padding: "60px" }}>
                <ShieldAlert size={40} style={{ marginBottom: "15px" }} />
                <p>No transmission requests in current pipeline.</p>
              </div>
            ) : (
              filteredReqs.map((r) => (
                <div
                  key={r._id}
                  className={`glass card ${selectedReq?._id === r._id ? "active-border" : ""}`}
                  onClick={() => setSelectedReq(r)}
                  style={{
                    marginBottom: "12px",
                    cursor: "pointer",
                    borderLeft: `4px solid ${r.status === "Approved" ? "var(--success)" : r.status === "Pending" ? "var(--warning)" : "var(--danger)"}`,
                    padding: "15px",
                    transition: "all 0.2s ease",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}>
                      <div
                        className="stat-icon-circle"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                        }}>
                        {getCategoryIcon(r.category)}
                      </div>
                      <div>
                        <strong
                          style={{ display: "block", fontSize: "0.9rem" }}>
                          {r.employeeId?.name || "Node Unknown"}
                        </strong>
                        <small style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                          {r.duration} Days •{" "}
                          {new Date(r.startDate).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      style={{
                        opacity: selectedReq?._id === r._id ? 1 : 0.2,
                        color: "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Decision Hub */}
        <div className="col right glass" style={{ padding: "20px" }}>
          <div className="section-header" style={{ marginBottom: "20px" }}>
            <span className="mini-label">DECISION PROTOCOL</span>
          </div>

          {selectedReq ? (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <div
                className="ai-insight-box"
                style={{
                  background: "rgba(0, 242, 254, 0.03)",
                  border: "1px solid var(--accent-soft)",
                  borderRadius: "12px",
                  padding: "20px",
                }}>
                <div
                  className="ai-head"
                  style={{
                    color: "var(--accent)",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <Sparkles size={16} />
                    <span
                      style={{ fontWeight: "bold", letterSpacing: "0.5px" }}>
                      TARGET: {selectedReq.employeeId?.name?.toUpperCase()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "rgba(255,255,255,0.05)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}>
                    {getCategoryIcon(selectedReq.category)}
                    <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                      {selectedReq.category?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="mini-label">RATIONALE / METADATA</label>
                  <p
                    style={{
                      fontStyle: "italic",
                      fontSize: "0.85rem",
                      color: "white",
                      marginTop: "8px",
                      lineHeight: "1.4",
                      background: "rgba(0,0,0,0.2)",
                      padding: "10px",
                      borderRadius: "8px",
                    }}>
                    "
                    {selectedReq.reason || "No documentation provided by node."}
                    "
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginBottom: "20px",
                  }}>
                  <div>
                    <label className="mini-label">START PHASE</label>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        marginTop: "4px",
                      }}>
                      {new Date(selectedReq.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="mini-label">END PHASE</label>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        marginTop: "4px",
                      }}>
                      {new Date(selectedReq.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {selectedReq.status === "Pending" ? (
                  <>
                    <div
                      className="form-group"
                      style={{ marginBottom: "20px" }}>
                      <label className="mini-label">
                        <ShieldAlert size={10} style={{ marginRight: "5px" }} />{" "}
                        REJECTION LOGS (REQUIRED FOR REJECT)
                      </label>
                      <textarea
                        className="glass-input"
                        placeholder="Specify reason for protocol denial..."
                        value={rejectionReason}
                        style={{
                          width: "93%",
                          marginTop: "8px",
                          minHeight: "80px",
                          fontSize: "0.8rem",
                        }}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="action-btn"
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "var(--success)",
                          color: "#000",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                        onClick={() =>
                          executeStatusUpdate(
                            selectedReq._id,
                            "Approved",
                            "",
                            "Pending",
                          )
                        }>
                        <Check size={16} /> APPROVE
                      </button>
                      <button
                        className="action-btn"
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "rgba(255, 118, 117, 0.1)",
                          color: "var(--danger)",
                          border: "1px solid var(--danger)",
                          fontWeight: "bold",
                        }}
                        onClick={() =>
                          rejectionReason
                            ? executeStatusUpdate(
                                selectedReq._id,
                                "Rejected",
                                rejectionReason,
                                "Pending",
                              )
                            : showToast("Reason Required", "error")
                        }>
                        REJECT
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}>
                      <p className="mini-label" style={{ marginBottom: "5px" }}>
                        RESOLVED STATE
                      </p>
                      <h3
                        style={{
                          margin: 0,
                          color:
                            selectedReq.status === "Approved"
                              ? "var(--success)"
                              : "var(--danger)",
                          letterSpacing: "2px",
                        }}>
                        {selectedReq.status.toUpperCase()}
                      </h3>
                    </div>

                    {selectedReq.status === "Approved" && (
                      <div
                        style={{
                          marginTop: "20px",
                          paddingTop: "15px",
                          borderTop: "1px dashed rgba(255, 118, 117, 0.2)",
                        }}>
                        <button
                          className="action-btn-mini"
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "rgba(255, 118, 117, 0.05)",
                            color: "var(--danger)",
                            border: "1px solid var(--danger)",
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 0 10px rgba(255, 118, 117, 0.1)",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "var(--danger)";
                            e.currentTarget.style.color = "#fff";
                            e.currentTarget.style.boxShadow =
                              "0 0 20px rgba(255, 118, 117, 0.4)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 118, 117, 0.05)";
                            e.currentTarget.style.color = "var(--danger)";
                            e.currentTarget.style.boxShadow =
                              "0 0 10px rgba(255, 118, 117, 0.1)";
                          }}
                          onClick={() =>
                            setRevokeModal({ show: true, id: selectedReq._id })
                          }>
                          <ShieldAlert size={14} />
                          INITIALIZE REVOCATION SEQUENCE
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.5,
                    margin: 0,
                    lineHeight: "1.4",
                  }}>
                  <ShieldAlert
                    size={12}
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  />
                  All status changes are final and synchronized across node
                  dashboards immediately upon execution.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                opacity: 0.3,
              }}>
              <BrainCircuit
                size={48}
                style={{ marginBottom: "20px", color: "var(--accent)" }}
              />
              <p className="mini-label" style={{ fontSize: "11px" }}>
                Waiting for Pipeline Selection
              </p>
              <p style={{ fontSize: "0.8rem" }}>
                Select a request node to initialize the decision protocol.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REVOKE POPUP MODAL - REDESIGNED */}
      {revokeModal.show && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(5, 8, 15, 0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}>
          <div
            className="glass"
            style={{
              width: "90%",
              maxWidth: "420px",
              padding: "30px",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(20, 25, 35, 0.85)",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02)",
              animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div
                style={{
                  background: "rgba(255, 118, 117, 0.1)",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 15px",
                  border: "1px solid var(--danger)",
                }}>
                <ShieldAlert size={30} style={{ color: "var(--danger)" }} />
              </div>
              <h2
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "1.5rem",
                  letterSpacing: "1px",
                }}>
                SYSTEM OVERRIDE
              </h2>
              <p
                className="mini-label"
                style={{ color: "var(--danger)", opacity: 0.8 }}>
                High Priority Revocation
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: "25px" }}>
              <label
                className="mini-label"
                style={{ marginBottom: "10px", display: "block" }}>
                REASON FOR TERMINATION
              </label>
              <textarea
                className="glass-input"
                autoFocus
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Enter justification for manual override..."
                style={{
                  width: "93%",
                  minHeight: "10px",
                  borderRadius: "12px",
                  padding: "15px",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                className="action-btn"
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "#000",
                  padding: "14px",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  borderRadius: "12px",
                  letterSpacing: "1px",
                }}
                onClick={() =>
                  revokeReason
                    ? executeStatusUpdate(
                        revokeModal.id,
                        "Rejected",
                        revokeReason,
                        "Approved",
                      )
                    : showToast("Justification required", "error")
                }>
                EXECUTE REVOKE
              </button>
              <button
                className="action-btn"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--accent)",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                }}
                onClick={() => {
                  setRevokeModal({ show: false, id: "" });
                  setRevokeReason("");
                }}>
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}