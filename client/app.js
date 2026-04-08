
const API_URL = "http://localhost:5000/api";
let radarChart;

// --- UTILS ---
window.showToast = (message, type = "info") => {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.5s forwards";
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};

// --- AUTH ---
window.handleLogin = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      location.reload();
    } else {
      window.showToast("Invalid Credentials", "error");
    }
  } catch (err) {
    window.showToast("Connection Error", "error");
  }
};

window.logout = function () {
  localStorage.clear();
  location.reload();
};

// --- NAVIGATION ---
window.showPage = function (pageId) {
  document
    .querySelectorAll(".page-content")
    .forEach((p) => (p.style.display = "none"));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.style.display = "block";

  if (pageId === "dashboard") loadStats();
  if (pageId === "office") loadMyOfficeData();
  if (pageId === "admin-workforce") loadAdminWorkforce();
  if (pageId === "admin-approvals") loadAdminApprovals();
};

// --- TASKS (EMPLOYEE SIDE) ---
async function loadMyOfficeData() {
  const taskList = document.getElementById("my-tasks-list");
  if (!taskList) return;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/employee/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
      window.showToast("Session mismatch. Please log out.", "error");
      return;
    }

    const me = await res.json();
    const pending =
      me.performance?.assignedTasks?.filter((t) => t.status === "Pending") ||
      [];

    taskList.innerHTML = pending.length
      ? pending
          .map(
            (t) => `
      <div class="talent-item glass" style="margin-bottom:10px; padding:15px; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${t.title}</strong><br><small>Due: ${new Date(t.deadline).toLocaleDateString()}</small></div>
        <button onclick="completeTask('${t._id}')" class="action-btn small">Complete</button>
      </div>`,
          )
          .join("")
      : "<p style='text-align:center; opacity:0.5; padding:20px;'>No pending tasks.</p>";

    loadEmployeeLeaveHistory();
  } catch (err) {
    console.error(err);
  }
}

window.completeTask = async function (taskId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/employee/complete-task/${taskId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    window.showToast("Task marked as Done!", "success");
    loadMyOfficeData();
  }
};

// --- TASKS (ADMIN SIDE) ---
window.openTaskModal = function (id, name) {
  document.getElementById("modal-employee-id").value = id;
  document.getElementById("modal-employee-name").innerText =
    `Assign to: ${name}`;
  document.getElementById("task-modal").style.display = "flex";
};

window.closeTaskModal = function () {
  document.getElementById("task-modal").style.display = "none";
};

window.submitTask = async function () {
  const employeeId = document.getElementById("modal-employee-id").value;
  const title = document.getElementById("task-title").value;
  const deadline = document.getElementById("task-deadline").value;
  const token = localStorage.getItem("token");

  if (!title || !deadline) return window.showToast("Fields required", "error");

  const res = await fetch(`${API_URL}/admin/assign-task`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employeeId, title, deadline }),
  });
  if (res.ok) {
    window.showToast("Task Assigned!", "success");
    window.closeTaskModal();
  }
};

// --- ENDORSEMENTS ---
window.endorseUser = async function (id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/employee/endorse/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      window.showToast("Endorsed!", "success");
      loadStats();
    } else {
      window.showToast(data.error || "Failed", "error");
    }
  } catch (err) {
    window.showToast("Error", "error");
  }
};

// --- DASHBOARD DATA ---
async function loadStats() {
  const grid = document.getElementById("talent-grid");
  if (!grid) return;
  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("userId");

  try {
    const res = await fetch(`${API_URL}/admin/talent-hub`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await res.json();

    grid.innerHTML = users
      .map((u) => {
        const isSelf = u._id === myId;
        const alreadyEndorsed = u.performance?.endorsedBy?.includes(myId);
        return `
        <div class="talent-item glass" style="padding:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <div><strong>${u.name} ${isSelf ? "(You)" : ""}</strong><br><small>${u.department}</small></div>
          <div>
            <span style="margin-right:10px">⭐ ${u.performance?.endorsements || 0}</span>
            <button onclick="endorseUser('${u._id}')" class="action-btn small" ${isSelf || alreadyEndorsed ? 'disabled style="opacity:0.5"' : ""}>
              ${alreadyEndorsed ? "Endorsed" : "Endorse"}
            </button>
          </div>
        </div>`;
      })
      .join("");
    if (!radarChart) initChart();
  } catch (e) {
    console.error(e);
  }
}

// --- WORKFORCE & LEAVE ---
async function loadAdminWorkforce() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return;
  const data = await res.json();
  document.getElementById("burn-rate").innerText =
    `$${data.totalSalaryBurn.toLocaleString()}`;
  document.getElementById("admin-employee-table").innerHTML = data.employees
    .map(
      (e) => `
    <div class="talent-item glass" style="margin-bottom:5px; padding:10px; display:flex; justify-content:space-between;">
      <span>${e.name}</span>
      <button onclick="openTaskModal('${e._id}', '${e.name}')" class="action-btn small">Assign</button>
    </div>`,
    )
    .join("");
}

async function loadAdminApprovals() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/leave-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return;
  const requests = await res.json();
  document.getElementById("admin-leave-list").innerHTML = requests
    .map(
      (r) => `
    <div class="talent-item glass" style="margin-bottom:10px; padding:15px; display:flex; justify-content:space-between;">
      <div><strong>${r.employeeId?.name}</strong>: ${r.duration} days</div>
      ${r.status === "Pending" ? `<button onclick="updateLeaveStatus('${r._id}', 'Approved')" class="action-btn small" style="background:#2ed573">Approve</button>` : `<span>${r.status}</span>`}
    </div>`,
    )
    .join("");
}

window.updateLeaveStatus = async function (id, status) {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/admin/leave-status/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  loadAdminApprovals();
};

window.submitLeave = async function () {
  const duration = document.getElementById("leave-days").value;
  const reason = document.getElementById("leave-reason").value;
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/employee/leave`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ duration, reason }),
  });
  window.showToast("Request Sent");
  loadEmployeeLeaveHistory();
};

async function loadEmployeeLeaveHistory() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/employee/leave-history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return;
  const data = await res.json();
  document.getElementById("employee-leave-history").innerHTML = data
    .map(
      (l) =>
        `<div style="padding:10px; border-bottom:1px solid #333;">${l.duration} days - ${l.status}</div>`,
    )
    .join("");
}

function initChart() {
  const canvas = document.getElementById("radarChart");
  if (!canvas) return;
  radarChart = new Chart(canvas.getContext("2d"), {
    type: "radar",
    data: {
      labels: ["Tasks", "Speed", "Quality", "On-Time", "Skills"],
      datasets: [
        {
          label: "Team",
          data: [85, 92, 78, 90, 88],
          backgroundColor: "rgba(0, 242, 254, 0.2)",
          borderColor: "#00f2fe",
        },
      ],
    },
    options: {
      scales: {
        r: {
          grid: { color: "rgba(255,255,255,0.1)" },
          pointLabels: { color: "white" },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("user-name-display").innerText =
      localStorage.getItem("userName");
    if (localStorage.getItem("userRole") === "Admin")
      document.getElementById("admin-nav").style.display = "block";
    window.showPage("dashboard");
  }
});