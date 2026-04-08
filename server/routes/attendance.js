const router = require("express").Router();
const Attendance = require("../models/Attendance");
const { verifyToken } = require("../middleware/auth");

// POST: Toggle Check-In / Check-Out
router.post("/toggle", verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    // This look-up is date-specific. If yesterday's checkout was missed,
    // this will still return null for 'today', allowing a fresh Check-In.
    let record = await Attendance.findOne({ userId: req.user.id, date: today });

    if (!record) {
      // First check-in of the day
      record = new Attendance({
        userId: req.user.id,
        date: today,
        checkInTime: new Date(),
        status: "P",
      });
      await record.save();
      return res.json({ message: "Checked In Successfully", record });
    } else if (!record.checkOutTime) {
      // Perform Check-out for today's active session
      record.checkOutTime = new Date();
      await record.save();
      return res.json({ message: "Checked Out Successfully", record });
    } else {
      // If today's record already has a check-out time
      return res.status(400).json({ error: "Already checked out for today." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Today's Stats
router.get("/my-stats", verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const record = await Attendance.findOne({
      userId: req.user.id,
      date: today,
    });
    res.json(record || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Monthly History
router.get("/history/:year/:month", verifyToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const regex = new RegExp(`^${year}-${month.padStart(2, "0")}`);
    const history = await Attendance.find({
      userId: req.user.id,
      date: { $regex: regex },
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;