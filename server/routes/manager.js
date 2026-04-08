// const router = require("express").Router();
// const User = require("../models/User");
// const Attendance = require("../models/Attendance");
// const Report = require("../models/Report");
// const { verifyToken, authorize } = require("../middleware/auth");

// // Internal Helper: Ensures Manager only accesses users in their department
// const checkDeptAccess = async (managerId, targetUserId) => {
//   const manager = await User.findById(managerId);
//   const target = await User.findById(targetUserId);
//   return manager && target && manager.department === target.department;
// };

// // GET: Department Leads for Task Assignment
// router.get("/my-leads", verifyToken, authorize("Manager"), async (req, res) => {
//   try {
//     const manager = await User.findById(req.user.id);

//     // Find only Leads in the same department
//     const leads = await User.find({
//       role: "Lead",
//       department: manager.department
//     }, "name role department performance");

//     res.json(leads);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post(
//   "/assign-task-to-lead",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       const { leadId, title, deadline } = req.body;

//       const lead = await User.findById(leadId);
//       if (!lead || lead.role !== "Lead") {
//         return res.status(404).json({ error: "Lead target not found" });
//       }

//       const manager = await User.findById(req.user.id);

//       lead.performance.assignedTasks.push({
//         title,
//         deadline: new Date(deadline),
//         status: "Pending",
//         assignedBy: {
//           name: manager.name,
//           role: manager.role, // "Manager"
//           id: manager._id,
//         },
//       });

//       await lead.save();
//       res.json({ message: "Task deployed to Lead!" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 1. GET: Summary of Leads
// router.get(
//   "/leads-summary",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       const manager = await User.findById(req.user.id);
//       const leads = await User.find({
//         role: "Lead",
//         department: manager.department,
//       });

//       const summary = await Promise.all(
//         leads.map(async (lead) => {
//           const count = await User.countDocuments({ lead_id: lead._id });
//           return {
//             _id: lead._id,
//             name: lead.name,
//             employeeCount: count,
//             status: lead.pulseStatus || "Available",
//           };
//         }),
//       );
//       res.json(summary);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 2. GET: Employee/Lead Tasks (For Manager Audit)
// router.get(
//   "/employee-tasks/:memberId",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       if (!(await checkDeptAccess(req.user.id, req.params.memberId))) {
//         return res
//           .status(403)
//           .json({ error: "Access Denied: Department mismatch" });
//       }
//       const user = await User.findById(req.params.memberId);
//       res.json(user.performance?.assignedTasks || []);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 3. GET: Employee/Lead Attendance (For Manager Audit)
// router.get(
//   "/employee-attendance/:memberId",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       if (!(await checkDeptAccess(req.user.id, req.params.memberId))) {
//         return res.status(403).json({ error: "Access Denied" });
//       }
//       const logs = await Attendance.find({ userId: req.params.memberId }).sort({
//         date: -1,
//       });
//       const formattedLogs = logs.map((log) => ({
//         date: log.date,
//         checkInTime: log.checkInTime,
//         checkOutTime: log.checkOutTime,
//         totalHours:
//           log.checkInTime && log.checkOutTime
//             ? (
//                 (new Date(log.checkOutTime) - new Date(log.checkInTime)) /
//                 3600000
//               ).toFixed(1)
//             : 0,
//         isLate: log.checkInTime
//           ? new Date(log.checkInTime).getHours() >= 9
//           : false,
//       }));
//       res.json(formattedLogs);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 4. GET: Employee/Lead EODs (For Manager Audit)
// router.get(
//   "/employee-eods/:memberId",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       if (!(await checkDeptAccess(req.user.id, req.params.memberId))) {
//         return res.status(403).json({ error: "Access Denied" });
//       }
//       const reports = await Report.find({ userId: req.params.memberId }).sort({
//         date: -1,
//       });
//       res.json(
//         reports.map((r) => ({
//           _id: r._id,
//           createdAt: r.date,
//           summary: r.workDone,
//           blockers: r.blockers,
//           status: r.status,
//           session: r.session,
//         })),
//       );
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 2. GET: All employees Organization Directory
// router.get(
//   "/all-employees",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       const manager = await User.findById(req.user.id);
//       if (!manager) return res.status(404).json({ error: "Manager not found" });

//       const employees = await User.find({
//         role: "Employee",
//         department: manager.department,
//       })
//         .populate("lead_id", "name")
//         .select("name role lead_id performance");

//       const formatted = employees.map((e) => {
//         const tasks = e.performance?.assignedTasks || [];
//         const activeTasks = tasks.filter((t) => t.status !== "Completed");
//         const latestTask =
//           activeTasks.length > 0 ? activeTasks[activeTasks.length - 1] : null;

//         return {
//           _id: e._id,
//           name: e.name,
//           role: e.role,
//           assignedLeadName: e.lead_id ? e.lead_id.name : "Direct Management",
//           currentTask: latestTask ? latestTask.title : "Idle",
//         };
//       });

//       res.json(formatted);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// router.get(
//   "/all-employees",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       const manager = await User.findById(req.user.id);
//       if (!manager) return res.status(404).json({ error: "Manager not found" });

//       const employees = await User.find({
//         role: "Employee",
//         department: manager.department,
//       }).populate("lead_id", "name");

//       const Attendance = require("../models/Attendance");

//       const formatted = await Promise.all(
//         employees.map(async (e) => {
//           const tasks = e.performance?.assignedTasks || [];

//           const activeTasks = tasks.filter((t) => t.status !== "Completed");
//           const latestTask =
//             activeTasks.length > 0 ? activeTasks[activeTasks.length - 1] : null;

//           const pendingTasks = activeTasks.length;

//           // 🔥 Attendance intelligence
//           const logs = await Attendance.find({ userId: e._id });

//           let totalHours = 0;
//           logs.forEach((log) => {
//             if (log.checkInTime && log.checkOutTime) {
//               const diff =
//                 new Date(log.checkOutTime) - new Date(log.checkInTime);
//               totalHours += diff / (1000 * 60 * 60);
//             }
//           });

//           totalHours = Math.round(totalHours);

//           return {
//             _id: e._id,
//             name: e.name,
//             role: e.role,
//             assignedLeadName: e.lead_id ? e.lead_id.name : "Direct Management",

//             currentTask: latestTask ? latestTask.title : "Idle",
//             status: latestTask
//               ? latestTask.status
//               : e.pulseStatus || "Available",

//             pendingTasks,
//             totalHours,
//           };
//         }),
//       );

//       res.json(formatted);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 3. GET: Company-wide Analytics
// router.get(
//   "/company-performance",
//   verifyToken,
//   authorize("Manager"),
//   async (req, res) => {
//     try {
//       const manager = await User.findById(req.user.id);
//       const users = await User.find(
//         { department: manager.department },
//         "performance.assignedTasks",
//       );

//       let completed = 0;
//       let pending = 0;

//       users.forEach((u) => {
//         u.performance.assignedTasks.forEach((t) => {
//           if (t.status === "Completed") completed++;
//           else pending++;
//         });
//       });

//       res.json({ completed, pending });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// module.exports = router;

const router = require("express").Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Report = require("../models/Report");
const { verifyToken, authorize } = require("../middleware/auth");

// Internal Helper: Ensures Manager only accesses users in their department
const checkDeptAccess = async (managerId, targetUserId) => {
  const manager = await User.findById(managerId);
  const target = await User.findById(targetUserId);
  return manager && target && manager.department === target.department;
};

// ✅ GET MANAGER'S PROFILE
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Department Leads for Task Assignment
router.get("/my-leads", verifyToken, authorize("Manager"), async (req, res) => {
  try {
    const manager = await User.findById(req.user.id);
    const leads = await User.find(
      {
        role: "Lead",
        department: manager.department,
      },
      "name role department performance",
    );
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/assign-task-to-lead",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      const { leadId, title, deadline } = req.body;
      const lead = await User.findById(leadId);
      if (!lead || lead.role !== "Lead") {
        return res.status(404).json({ error: "Lead target not found" });
      }

      const manager = await User.findById(req.user.id);
      lead.performance.assignedTasks.push({
        title,
        deadline: new Date(deadline),
        status: "Pending",
        assignedBy: {
          name: manager.name,
          role: manager.role,
          id: manager._id,
        },
      });

      await lead.save();
      res.json({ message: "Task deployed to Lead!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// GET: Summary of Leads
router.get(
  "/leads-summary",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      const manager = await User.findById(req.user.id);
      const leads = await User.find({
        role: "Lead",
        department: manager.department,
      });

      const summary = await Promise.all(
        leads.map(async (lead) => {
          const count = await User.countDocuments({ lead_id: lead._id });
          return {
            _id: lead._id,
            name: lead.name,
            employeeCount: count,
            status: lead.pulseStatus || "Available",
          };
        }),
      );
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// GET: Employee/Lead Tasks (Audit)
router.get(
  "/employee-tasks/:memberId",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      if (!(await checkDeptAccess(req.user.id, req.params.memberId))) {
        return res.status(403).json({ error: "Access Denied" });
      }
      const user = await User.findById(req.params.memberId);
      res.json(user.performance?.assignedTasks || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// GET: Employee/Lead Attendance (Audit)
router.get(
  "/employee-attendance/:memberId",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      if (!(await checkDeptAccess(req.user.id, req.params.memberId))) {
        return res.status(403).json({ error: "Access Denied" });
      }
      const logs = await Attendance.find({ userId: req.params.memberId }).sort({
        date: -1,
      });
      const formattedLogs = logs.map((log) => ({
        date: log.date,
        checkInTime: log.checkInTime,
        checkOutTime: log.checkOutTime,
        totalHours:
          log.checkInTime && log.checkOutTime
            ? (
                (new Date(log.checkOutTime) - new Date(log.checkInTime)) /
                3600000
              ).toFixed(1)
            : 0,
        isLate: log.checkInTime
          ? new Date(log.checkInTime).getHours() >= 9
          : false,
      }));
      res.json(formattedLogs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// GET: Employee/Lead EODs (Audit)
router.get(
  "/employee-eods/:memberId",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      if (!(await checkDeptAccess(req.user.id, req.params.memberId))) {
        return res.status(403).json({ error: "Access Denied" });
      }
      const reports = await Report.find({ userId: req.params.memberId }).sort({
        date: -1,
      });
      res.json(
        reports.map((r) => ({
          _id: r._id,
          createdAt: r.date,
          summary: r.workDone,
          blockers: r.blockers,
          status: r.status,
          session: r.session,
        })),
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// GET: Organization Directory
router.get(
  "/all-employees",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      const manager = await User.findById(req.user.id);
      const employees = await User.find({
        role: "Employee",
        department: manager.department,
      }).populate("lead_id", "name");

      const formatted = await Promise.all(
        employees.map(async (e) => {
          const tasks = e.performance?.assignedTasks || [];
          const activeTasks = tasks.filter((t) => t.status !== "Completed");
          const latestTask =
            activeTasks.length > 0 ? activeTasks[activeTasks.length - 1] : null;

          const logs = await Attendance.find({ userId: e._id });
          let totalHours = 0;
          logs.forEach((log) => {
            if (log.checkInTime && log.checkOutTime) {
              totalHours +=
                (new Date(log.checkOutTime) - new Date(log.checkInTime)) /
                3600000;
            }
          });

          return {
            _id: e._id,
            name: e.name,
            role: e.role,
            assignedLeadName: e.lead_id ? e.lead_id.name : "Direct Management",
            currentTask: latestTask ? latestTask.title : "Idle",
            status: e.pulseStatus || "Available",
            pendingTasks: activeTasks.length,
            totalHours: Math.round(totalHours),
          };
        }),
      );
      res.json(formatted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// GET: Company Performance
router.get(
  "/company-performance",
  verifyToken,
  authorize("Manager"),
  async (req, res) => {
    try {
      const manager = await User.findById(req.user.id);
      const users = await User.find(
        { department: manager.department },
        "performance.assignedTasks",
      );
      let completed = 0;
      let pending = 0;
      users.forEach((u) => {
        u.performance.assignedTasks.forEach((t) => {
          if (t.status === "Completed") completed++;
          else pending++;
        });
      });
      res.json({ completed, pending });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;