const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getData", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c1.category_id, 
        c1.name AS category_name, 
        c2.name AS parent_category_name,
        l.language_name,
        c1.is_active
      FROM 
        category_id c1
        LEFT JOIN category_id c2 ON c1.parent_id = c2.category_id
        LEFT JOIN language l ON c1.language_id = l.language_id
      WHERE 
        c1.parent_id IS NOT NULL 
    `);

    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;