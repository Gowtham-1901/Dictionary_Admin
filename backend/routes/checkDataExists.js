const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/checkDataExists/:category_id", async (req, res) => {
  const category_id = req.params.category_id;

  try {
    const existingData = await pool.query(
      "SELECT * FROM dictionary WHERE category_id = $1",
      [category_id]
    );
    res.send(existingData.rows);
  } catch (error) {
    console.error("Error checking data:", error);
    return res.status(500).send("Error processing data.");
  }
});

module.exports = router;