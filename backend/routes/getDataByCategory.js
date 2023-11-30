const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getDataByCategory/:category_id", async (req, res) => {
  const category_id = req.params.category_id;
  try {
    const result = await pool.query(
      `SELECT d.file_data 
FROM dictionary d
JOIN category_id c ON d.category_id = c.category_id
WHERE c.parent_id = $1 AND c.is_active = true AND d.is_active = true
`,
      [category_id]
    );

    res.send(result.rows);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;