import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Radar } from "react-chartjs-2";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { MdStars } from "react-icons/md";
import { MdOutlineStars } from "react-icons/md";


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

const API_URL = "https://syncnodeems.onrender.com/api";

function Dashboard({ token, userId, showToast, userRole }) {
  const [talents, setTalents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [notifications, setNotifications] = useState([]);

  // Modal & Notification States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState("Today"); // Today, All, Date
  const [filterDate, setFilterDate] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  const [metrics, setMetrics] = useState({
    tasks: 0,
    speed: 0,
    quality: 0,
    onTime: 0,
    efficiency: 0,
  });

  const fetchData = async () => {
    try {
      const [talentRes, metricRes, notifyRes] = await Promise.all([
        axios.get(`${API_URL}/admin/talent-hub`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/employee/performance-metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/notifications/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTalents(talentRes.data);
      setMetrics(metricRes.data);

      const fetchedNotifs = notifyRes.data;
      setNotifications(fetchedNotifs);

      // Check for unread notifications using LocalStorage
      const lastRead = localStorage.getItem(`lastReadNotif_${userId}`);
      if (fetchedNotifs.length > 0) {
        const latestNotifTime = new Date(
          fetchedNotifs[0].fullDate || Date.now(),
        ).getTime();
        if (!lastRead || latestNotifTime > parseInt(lastRead)) {
          setHasUnread(true);
        }
      }
    } catch (e) {
      console.error("Fetch Error:", e);
      showToast("Could not load dashboard data", "error");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Handle opening modal
  const openNotifications = () => {
    setIsModalOpen(true);
    setHasUnread(false);
    localStorage.setItem(`lastReadNotif_${userId}`, Date.now().toString());
  };

  // Filtered Notifications Logic
  const filteredNotifications = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return notifications.filter((n) => {
      const nDate = n.fullDate ? n.fullDate.split("T")[0] : today;
      if (notifFilter === "Today") return nDate === today;
      if (notifFilter === "Date" && filterDate) return nDate === filterDate;
      return true; // "All"
    });
  }, [notifications, notifFilter, filterDate]);

  const departments = useMemo(() => {
    const set = new Set(talents.map((t) => t.department).filter(Boolean));
    return ["All Departments", ...Array.from(set).sort()];
  }, [talents]);

  const roles = useMemo(() => {
    const set = new Set(talents.map((t) => t.role).filter(Boolean));
    return ["All Roles", ...Array.from(set).sort()];
  }, [talents]);

  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      const nameMatch = t.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const deptMatch =
        deptFilter === "All Departments" || t.department === deptFilter;
      const roleMatch = roleFilter === "All Roles" || t.role === roleFilter;
      return nameMatch && deptMatch && roleMatch;
    });
  }, [talents, searchQuery, deptFilter, roleFilter]);

  const handleEndorse = async (targetId) => {
    try {
      await axios.post(
        `${API_URL}/employee/endorse/${targetId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      showToast("Endorsed!", "success");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || "Error", "error");
    }
  };

  const selectStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    padding: "4px 8px",
    color: "white",
    fontSize: "0.75rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <section
      className="page-content"
      style={{
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        padding: "0 20px 20px 20px",
        boxSizing: "border-box",
      }}>
      {/* --- NOTIFICATION BUTTON --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}>
        <button
          onClick={openNotifications}
          className="glass"
          style={{
            position: "relative",
            padding: "8px 16px",
            border: "1px solid rgba(0, 242, 254, 0.3)",
            borderRadius: "20px",
            color: "#00f2fe",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "0.3s",
          }}>
          <IoNotificationsCircleSharp size={18} />
          Check Updates
          {hasUnread && (
            <span
              style={{
                position: "absolute",
                top: "1px",
                right: "-2px",
                width: "10px",
                height: "10px",
                background: "#ff4b82",
                borderRadius: "50%",
                boxShadow: "0 0 10px #ff4b82",
              }}
            />
          )}
        </button>
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "flex",
          gap: "20px",
          height: "calc(100% - 60px)",
          alignItems: "stretch",
        }}>
        {/* Left Side: Performance */}
        <div
          className="glass card"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            padding: "20px",
          }}>
          <h3 style={{ marginBottom: "15px", marginTop: 0 }}>My Performance</h3>
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <Radar
              data={{
                labels: ["Tasks", "Speed", "Quality", "On-Time", "Efficiency"],
                datasets: [
                  {
                    label: "Your Performance",
                    data: [
                      metrics.tasks,
                      metrics.speed,
                      metrics.quality,
                      metrics.onTime,
                      metrics.efficiency,
                    ],
                    backgroundColor: "rgba(0, 242, 254, 0.2)",
                    borderColor: "#00f2fe",
                    pointBackgroundColor: "#00f2fe",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { display: false, stepSize: 20 },
                    grid: { color: "rgba(255,255,255,0.1)" },
                    angleLines: { color: "rgba(255,255,255,0.1)" },
                    pointLabels: { color: "white", font: { size: 11 } },
                  },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Right Side: Talent Hub */}
        <div
          className="glass card"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            padding: "20px",
          }}>
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}>
              <h3 style={{ margin: 0 }}>
                Talent Hub ({filteredTalents.length})
              </h3>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...selectStyle, width: "120px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                className="custom-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}>
                {departments.map((d) => (
                  <option key={d} value={d} style={{ background: "#1a1a1a" }}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                className="custom-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}>
                {roles.map((r) => (
                  <option key={r} value={r} style={{ background: "#1a1a1a" }}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="talent-list-scroll"
            style={{ overflowY: "auto", flex: 1 }}>
            {filteredTalents.map((t) => (
              <div
                key={t._id}
                className="glass"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  marginBottom: "10px",
                  background: "rgba(255,255,255,0.02)",
                }}>
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>
                    {t.name} {t._id === userId && "(You)"}
                  </strong>
                  <div style={{ opacity: 0.6, fontSize: "0.7rem" }}>
                    {t.role} • {t.department}
                  </div>
                </div>
                <div className="endorsement-container">
                  <span className="endorsement-count">
                    <MdStars size={18} />
                    <span className="count-value">
                      {t.performance?.endorsements || 0}
                    </span>
                  </span>

                  <button
                    disabled={
                      t._id === userId ||
                      t.performance?.endorsedBy?.includes(userId)
                    }
                    onClick={() => handleEndorse(t._id)}
                    className={`action-btn small endorse-btn ${t.performance?.endorsedBy?.includes(userId) ? "is-endorsed" : ""}`}>
                    {t.performance?.endorsedBy?.includes(userId)
                      ? "Endorsed"
                      : "Endorse"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NOTIFICATION MODAL --- */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(5px)",
          }}>
          <div
            className="glass card"
            style={{
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              padding: "25px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 30px rgba(0,0,0,0.5)",
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}>
              <h3 style={{ margin: 0, color: "#00f2fe" }}>🔔 Updates</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}>
                &times;
              </button>
            </div>

            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}>
              {["Today", "All", "Date"].map((f) => (
                <button
                  key={f}
                  onClick={() => setNotifFilter(f)}
                  style={{
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    borderRadius: "15px",
                    border: "1px solid #00f2fe",
                    background: notifFilter === f ? "#00f2fe" : "transparent",
                    color: notifFilter === f ? "#000" : "#00f2fe",
                    cursor: "pointer",
                  }}>
                  {f}
                </button>
              ))}
              {notifFilter === "Date" && (
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={{ ...selectStyle, padding: "2px 8px" }}
                />
              )}
            </div>

            <div style={{ overflowY: "auto", flex: 1, paddingRight: "5px" }}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((note, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      borderLeft: "4px solid #00f2fe",
                    }}>
                    <div style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
                      {note.message}
                    </div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                      {note.time} •{" "}
                      {note.fullDate
                        ? new Date(note.fullDate).toLocaleDateString()
                        : "Today"}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.5,
                    marginTop: "20px",
                  }}>
                  No notifications found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;