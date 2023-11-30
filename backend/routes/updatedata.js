const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/updateData", async (req, res) => {
  const { jsonData, category_id } = req.body;
  const jsonDataString = JSON.stringify(jsonData);
  await pool.query(
    "INSERT INTO dictionary (is_active,file_data,category_id) VALUES (true,$1,$2)",
    [jsonDataString, category_id]
  );
});

module.exports = router;