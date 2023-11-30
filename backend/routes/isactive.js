const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/isactive/:id", async (req, res) => {
  const { isactive } = req.body;
  const id = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE category_id SET is_active=$1 WHERE category_id =$2 RETURNING *",
      [isactive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid ID. Data not found." });
    }

    res.send(result.rows);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;