// // // const router = require("express").Router();
// // // const User = require("../models/User");
// // // const LeaveRequest = require("../models/LeaveRequest");
// // // const bcrypt = require("bcryptjs");
// // // const { verifyToken, authorize } = require("../middleware/auth");

// // // // 1. GET: Dashboard Stats
// // // router.get(
// // //   "/dashboard-stats",
// // //   verifyToken,
// // //   authorize("Admin"),
// // //   async (req, res) => {
// // //     try {
// // //       const users = await User.find()
// // //         .populate("lead_id", "name")
// // //         .populate("manager_id", "name");
// // //       const totalBurn = users.reduce((sum, u) => sum + (u.salary || 0), 0);
// // //       res.json({ totalSalaryBurn: totalBurn, employees: users });
// // //     } catch (err) {
// // //       res.status(500).json({ error: err.message });
// // //     }
// // //   },
// // // );

// // // // 2. GET: Public Talent Hub
// // // router.get("/talent-hub", verifyToken, async (req, res) => {
// // //   try {
// // //     // ADDED 'role' to the projection string below
// // //     const users = await User.find(
// // //       {},
// // //       "name role department pulseStatus performance",
// // //     );
// // //     res.json(users);
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // // 3. GET: All Leave Requests
// // // router.get(
// // //   "/leave-requests",
// // //   verifyToken,
// // //   authorize("Admin"),
// // //   async (req, res) => {
// // //     try {
// // //       const requests = await LeaveRequest.find()
// // //         .populate("employeeId", "name department")
// // //         .sort({ _id: -1 });
// // //       res.json(requests);
// // //     } catch (err) {
// // //       res.status(500).json({ error: err.message });
// // //     }
// // //   },
// // // );

// // // // 4. PATCH: Update Leave Status
// // // router.patch(
// // //   "/leave-status/:id",
// // //   verifyToken,
// // //   authorize("Admin"),
// // //   async (req, res) => {
// // //     try {
// // //       const updated = await LeaveRequest.findByIdAndUpdate(
// // //         req.params.id,
// // //         { status: req.body.status },
// // //         { new: true },
// // //       );
// // //       res.json(updated);
// // //     } catch (err) {
// // //       res.status(500).json({ error: err.message });
// // //     }
// // //   },
// // // );

// // // router.post(
// // //   "/assign-task",
// // //   verifyToken,
// // //   authorize("Admin"),
// // //   async (req, res) => {
// // //     try {
// // //       const { employeeId, title, deadline } = req.body;
// // //       if (!employeeId || !title || !deadline)
// // //         return res.status(400).json({ error: "Missing data" });

// // //       const user = await User.findById(employeeId);
// // //       if (!user) return res.status(404).json({ error: "Employee not found" });

// // //       // Find the admin's name to store it
// // //       const admin = await User.findById(req.user.id);

// // //       user.performance.assignedTasks.push({
// // //         title,
// // //         deadline: new Date(deadline),
// // //         status: "Pending",
// // //         assignedBy: {
// // //           name: admin.name,
// // //           role: admin.role, // "Admin"
// // //           id: admin._id,
// // //         },
// // //       });

// // //       await user.save();
// // //       res.json({ message: "Task Assigned!" });
// // //     } catch (err) {
// // //       res.status(500).json({ error: err.message });
// // //     }
// // //   },
// // // );

// // // // 6. GET: Global Task Monitor
// // // router.get("/all-tasks", verifyToken, authorize("Admin"), async (req, res) => {
// // //   try {
// // //     const users = await User.find({}, "name performance.assignedTasks");
// // //     let allTasks = [];
// // //     users.forEach((u) => {
// // //       u.performance.assignedTasks.forEach((t) => {
// // //         allTasks.push({ ...t._doc, employeeName: u.name });
// // //       });
// // //     });
// // //     res.json(allTasks);
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // // 7. POST: Add New Employee
// // // router.post(
// // //   "/add-employee",
// // //   verifyToken,
// // //   authorize("Admin"),
// // //   async (req, res) => {
// // //     try {
// // //       const { name, email, role, department, password, lead_id, manager_id } =
// // //         req.body;

// // //       if (!name || !email || !password) {
// // //         return res.status(400).json({ error: "Missing required fields" });
// // //       }

// // //       const emailExists = await User.findOne({ email });
// // //       if (emailExists)
// // //         return res.status(400).json({ error: "Email already registered" });

// // //       // Sanitize IDs: Convert empty strings or falsey values to null
// // //       const finalLeadId = lead_id && lead_id !== "" ? lead_id : null;
// // //       const finalManagerId =
// // //         manager_id && manager_id !== "" ? manager_id : null;

// // //       let leadName = "Direct Management";
// // //       if (finalLeadId) {
// // //         const leadUser = await User.findById(finalLeadId);
// // //         if (leadUser) leadName = leadUser.name;
// // //       }

// // //       const salt = await bcrypt.genSalt(10);
// // //       const hashedPassword = await bcrypt.hash(password, salt);

// // //       const newUser = new User({
// // //         name,
// // //         email,
// // //         role,
// // //         department,
// // //         password: hashedPassword,
// // //         lead_id: finalLeadId,
// // //         manager_id: finalManagerId,
// // //         assignedLeadName: leadName,
// // //         salary: role === "Manager" ? 80000 : role === "Lead" ? 65000 : 45000,
// // //         performance: {
// // //           endorsements: 0,
// // //           endorsedBy: [],
// // //           assignedTasks: [],
// // //         },
// // //       });

// // //       await newUser.save();
// // //       res.status(201).json({
// // //         message: "Employee created successfully",
// // //         user: { id: newUser._id, name: newUser.name },
// // //       });
// // //     } catch (err) {
// // //       res.status(500).json({ error: err.message });
// // //     }
// // //   },
// // // );

// // // // 8. GET: Hierarchy Options
// // // router.get(
// // //   "/hierarchy-options",
// // //   verifyToken,
// // //   authorize("Admin"),
// // //   async (req, res) => {
// // //     try {
// // //       const { role, department } = req.query;
// // //       const query = {};
// // //       if (role) query.role = role;
// // //       if (department) query.department = department;
// // //       const users = await User.find(query, "name _id");
// // //       res.json(users);
// // //     } catch (err) {
// // //       res.status(500).json({ error: err.message });
// // //     }
// // //   },
// // // );

// // // module.exports = router;

// // const router = require("express").Router();
// // const User = require("../models/User");
// // const LeaveRequest = require("../models/LeaveRequest");
// // const bcrypt = require("bcryptjs");
// // const { verifyToken, authorize } = require("../middleware/auth");

// // // 1. GET: Dashboard Stats
// // router.get(
// //   "/dashboard-stats",
// //   verifyToken,
// //   authorize("Admin"),
// //   async (req, res) => {
// //     try {
// //       const users = await User.find()
// //         .populate("lead_id", "name")
// //         .populate("manager_id", "name");
// //       const totalBurn = users.reduce((sum, u) => sum + (u.salary || 0), 0);
// //       res.json({ totalSalaryBurn: totalBurn, employees: users });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // 2. GET: Public Talent Hub
// // router.get("/talent-hub", verifyToken, async (req, res) => {
// //   try {
// //     const users = await User.find(
// //       {},
// //       "name role department pulseStatus performance",
// //     );
// //     res.json(users);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // 3. GET: All Leave Requests
// // router.get(
// //   "/leave-requests",
// //   verifyToken,
// //   authorize("Admin"),
// //   async (req, res) => {
// //     try {
// //       const requests = await LeaveRequest.find()
// //         .populate("employeeId", "name department")
// //         .sort({ _id: -1 });
// //       res.json(requests);
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // 4. PATCH: Update Leave Status
// // router.patch(
// //   "/leave-status/:id",
// //   verifyToken,
// //   authorize("Admin"),
// //   async (req, res) => {
// //     try {
// //       const updated = await LeaveRequest.findByIdAndUpdate(
// //         req.params.id,
// //         { status: req.body.status },
// //         { new: true },
// //       );
// //       res.json(updated);
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // 5. POST: Assign Task
// // router.post(
// //   "/assign-task",
// //   verifyToken,
// //   authorize("Admin"),
// //   async (req, res) => {
// //     try {
// //       const { employeeId, title, deadline } = req.body;
// //       if (!employeeId || !title || !deadline)
// //         return res.status(400).json({ error: "Missing data" });

// //       const user = await User.findById(employeeId);
// //       if (!user) return res.status(404).json({ error: "Employee not found" });

// //       const admin = await User.findById(req.user.id);

// //       user.performance.assignedTasks.push({
// //         title,
// //         deadline: new Date(deadline),
// //         status: "Pending",
// //         assignedBy: {
// //           name: admin.name,
// //           role: admin.role,
// //           id: admin._id,
// //         },
// //       });

// //       await user.save();
// //       res.json({ message: "Task Assigned!" });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // 6. GET: Global Task Monitor
// // router.get("/all-tasks", verifyToken, authorize("Admin"), async (req, res) => {
// //   try {
// //     const users = await User.find({}, "name performance.assignedTasks");
// //     let allTasks = [];
// //     users.forEach((u) => {
// //       u.performance.assignedTasks.forEach((t) => {
// //         allTasks.push({ ...t._doc, employeeName: u.name });
// //       });
// //     });
// //     res.json(allTasks);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // 7. POST: Add New Employee
// // router.post(
// //   "/add-employee",
// //   verifyToken,
// //   authorize("Admin"),
// //   async (req, res) => {
// //     try {
// //       const { name, email, role, department, password, lead_id, manager_id } =
// //         req.body;

// //       if (!name || !email || !password) {
// //         return res.status(400).json({ error: "Missing required fields" });
// //       }

// //       const emailExists = await User.findOne({ email });
// //       if (emailExists)
// //         return res.status(400).json({ error: "Email already registered" });

// //       const finalLeadId = lead_id && lead_id !== "" ? lead_id : null;
// //       const finalManagerId =
// //         manager_id && manager_id !== "" ? manager_id : null;

// //       let leadName = "Direct Management";
// //       if (finalLeadId) {
// //         const leadUser = await User.findById(finalLeadId);
// //         if (leadUser) leadName = leadUser.name;
// //       }

// //       const salt = await bcrypt.genSalt(10);
// //       const hashedPassword = await bcrypt.hash(password, salt);

// //       const newUser = new User({
// //         name,
// //         email,
// //         role,
// //         department,
// //         password: hashedPassword,
// //         lead_id: finalLeadId,
// //         manager_id: finalManagerId,
// //         assignedLeadName: leadName,
// //         salary: role === "Manager" ? 80000 : role === "Lead" ? 65000 : 45000,
// //         performance: {
// //           endorsements: 0,
// //           endorsedBy: [],
// //           assignedTasks: [],
// //         },
// //       });

// //       await newUser.save();
// //       res.status(201).json({
// //         message: "Employee created successfully",
// //         user: { id: newUser._id, name: newUser.name },
// //       });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // 8. GET: Hierarchy Options
// // router.get(
// //   "/hierarchy-options",
// //   verifyToken,
// //   authorize("Admin"),
// //   async (req, res) => {
// //     try {
// //       const { role, department } = req.query;
// //       const query = {};
// //       if (role) query.role = role;
// //       if (department) query.department = department;
// //       const users = await User.find(query, "name _id");
// //       res.json(users);
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // 9. PATCH: Update Pulse Status (The Fix)
// // router.patch("/update-pulse", verifyToken, async (req, res) => {
// //   try {
// //     const { pulseStatus } = req.body;
// //     await User.findByIdAndUpdate(req.user.id, { pulseStatus });
// //     res.json({ message: "Status updated" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // module.exports = router;
// const router = require("express").Router();
// const User = require("../models/User");
// const LeaveRequest = require("../models/LeaveRequest");
// const bcrypt = require("bcryptjs");
// const { verifyToken, authorize } = require("../middleware/auth");

// // 1. GET: Dashboard Stats
// router.get(
//   "/dashboard-stats",
//   verifyToken,
//   authorize("Admin"),
//   async (req, res) => {
//     try {
//       const users = await User.find()
//         .populate("lead_id", "name")
//         .populate("manager_id", "name");
//       const totalBurn = users.reduce((sum, u) => sum + (u.salary || 0), 0);
//       res.json({ totalSalaryBurn: totalBurn, employees: users });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 2. GET: Public Talent Hub
// router.get("/talent-hub", verifyToken, async (req, res) => {
//   try {
//     const users = await User.find(
//       {},
//       "name role department pulseStatus performance",
//     );
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3. GET: All Leave Requests
// router.get(
//   "/leave-requests",
//   verifyToken,
//   authorize("Admin"),
//   async (req, res) => {
//     try {
//       const requests = await LeaveRequest.find()
//         .populate("employeeId", "name department")
//         .sort({ _id: -1 });
//       res.json(requests);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 4. PATCH: Update Leave Status
// router.patch(
//   "/leave-status/:id",
//   verifyToken,
//   authorize("Admin"),
//   async (req, res) => {
//     try {
//       const updated = await LeaveRequest.findByIdAndUpdate(
//         req.params.id,
//         { status: req.body.status },
//         { new: true },
//       );
//       res.json(updated);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 5. POST: Assign Task
// router.post(
//   "/assign-task",
//   verifyToken,
//   authorize("Admin"),
//   async (req, res) => {
//     try {
//       const { employeeId, title, deadline } = req.body;
//       if (!employeeId || !title || !deadline)
//         return res.status(400).json({ error: "Missing data" });

//       const user = await User.findById(employeeId);
//       if (!user) return res.status(404).json({ error: "Employee not found" });

//       const admin = await User.findById(req.user.id);

//       user.performance.assignedTasks.push({
//         title,
//         deadline: new Date(deadline),
//         status: "Pending",
//         assignedBy: {
//           name: admin.name,
//           role: admin.role,
//           id: admin._id,
//         },
//       });

//       await user.save();
//       res.json({ message: "Task Assigned!" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 6. GET: Global Task Monitor
// router.get("/all-tasks", verifyToken, authorize("Admin"), async (req, res) => {
//   try {
//     const users = await User.find({}, "name performance.assignedTasks");
//     let allTasks = [];
//     users.forEach((u) => {
//       u.performance.assignedTasks.forEach((t) => {
//         allTasks.push({ ...t._doc, employeeName: u.name });
//       });
//     });
//     res.json(allTasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 7. POST: Add New Employee
// router.post(
//   "/add-employee",
//   verifyToken,
//   authorize("Admin"),
//   async (req, res) => {
//     try {
//       const { name, email, role, department, password, lead_id, manager_id } =
//         req.body;

//       if (!name || !email || !password) {
//         return res.status(400).json({ error: "Missing required fields" });
//       }

//       const emailExists = await User.findOne({ email });
//       if (emailExists)
//         return res.status(400).json({ error: "Email already registered" });

//       const finalLeadId = lead_id && lead_id !== "" ? lead_id : null;
//       const finalManagerId =
//         manager_id && manager_id !== "" ? manager_id : null;

//       let leadName = "Direct Management";
//       if (finalLeadId) {
//         const leadUser = await User.findById(finalLeadId);
//         if (leadUser) leadName = leadUser.name;
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       const newUser = new User({
//         name,
//         email,
//         role,
//         department,
//         password: hashedPassword,
//         lead_id: finalLeadId,
//         manager_id: finalManagerId,
//         assignedLeadName: leadName,
//         salary: role === "Manager" ? 80000 : role === "Lead" ? 65000 : 45000,
//         performance: {
//           endorsements: 0,
//           endorsedBy: [],
//           assignedTasks: [],
//         },
//       });

//       await newUser.save();
//       res.status(201).json({
//         message: "Employee created successfully",
//         user: { id: newUser._id, name: newUser.name },
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 8. GET: Hierarchy Options
// router.get(
//   "/hierarchy-options",
//   verifyToken,
//   authorize("Admin"),
//   async (req, res) => {
//     try {
//       const { role, department } = req.query;
//       const query = {};
//       if (role) query.role = role;
//       if (department) query.department = department;
//       const users = await User.find(query, "name _id");
//       res.json(users);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // 9. PATCH: Update Pulse Status
// router.patch("/update-pulse", verifyToken, async (req, res) => {
//   try {
//     const { pulseStatus } = req.body;
//     await User.findByIdAndUpdate(req.user.id, { pulseStatus });
//     res.json({ message: "Status updated" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const router = require("express").Router();
const User = require("../models/User");
const LeaveRequest = require("../models/LeaveRequest");
const bcrypt = require("bcryptjs");
const { verifyToken, authorize } = require("../middleware/auth");

// 1. GET: Dashboard Stats
router.get(
  "/dashboard-stats",
  verifyToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const users = await User.find()
        .populate("lead_id", "name")
        .populate("manager_id", "name");
      const totalBurn = users.reduce((sum, u) => sum + (u.salary || 0), 0);
      res.json({ totalSalaryBurn: totalBurn, employees: users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// 2. GET: Public Talent Hub
router.get("/talent-hub", verifyToken, async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name role department pulseStatus performance",
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET: All Leave Requests
router.get(
  "/leave-requests",
  verifyToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const requests = await LeaveRequest.find()
        .populate("employeeId", "name department")
        .sort({ _id: -1 });
      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// 4. PATCH: Update Leave Status
router.patch(
  "/leave-status/:id",
  verifyToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const updated = await LeaveRequest.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// 5. POST: Assign Task
router.post(
  "/assign-task",
  verifyToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const { employeeId, title, deadline } = req.body;
      if (!employeeId || !title || !deadline)
        return res.status(400).json({ error: "Missing data" });

      const user = await User.findById(employeeId);
      if (!user) return res.status(404).json({ error: "Employee not found" });

      const admin = await User.findById(req.user.id);

      user.performance.assignedTasks.push({
        title,
        deadline: new Date(deadline),
        status: "Pending",
        assignedBy: {
          name: admin.name,
          role: admin.role,
          id: admin._id,
        },
      });

      await user.save();
      res.json({ message: "Task Assigned!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// 6. GET: Global Task Monitor
router.get("/all-tasks", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const users = await User.find({}, "name performance.assignedTasks");
    let allTasks = [];
    users.forEach((u) => {
      u.performance.assignedTasks.forEach((t) => {
        allTasks.push({ ...t._doc, employeeName: u.name });
      });
    });
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. POST: Add New Employee
router.post(
  "/add-employee",
  verifyToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const { name, email, role, department, password, lead_id, manager_id } =
        req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res.status(400).json({ error: "Email already registered" });

      const finalLeadId = lead_id && lead_id !== "" ? lead_id : null;
      const finalManagerId =
        manager_id && manager_id !== "" ? manager_id : null;

      let leadName = "Direct Management";
      if (finalLeadId) {
        const leadUser = await User.findById(finalLeadId);
        if (leadUser) leadName = leadUser.name;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        role,
        department,
        password: hashedPassword,
        lead_id: finalLeadId,
        manager_id: finalManagerId,
        assignedLeadName: leadName,
        salary: role === "Manager" ? 80000 : role === "Lead" ? 65000 : 45000,
        performance: {
          endorsements: 0,
          endorsedBy: [],
          assignedTasks: [],
        },
      });

      await newUser.save();
      res.status(201).json({
        message: "Employee created successfully",
        user: { id: newUser._id, name: newUser.name },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// 8. GET: Hierarchy Options
router.get(
  "/hierarchy-options",
  verifyToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const { role, department } = req.query;
      const query = {};
      if (role) query.role = role;
      if (department) query.department = department;
      const users = await User.find(query, "name _id");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// 9. PATCH: Update Pulse Status
router.patch("/update-pulse", verifyToken, async (req, res) => {
  try {
    const { pulseStatus } = req.body;
    // Update only the current user's status
    await User.findByIdAndUpdate(req.user.id, { pulseStatus });
    res.json({ message: "Status updated in database" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;