const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.put("/updateExistingData", async (req, res) => {
  const { jsonData, category_id } = req.body;
  const jsonDataString = JSON.stringify(jsonData);
  await pool.query(
    "UPDATE dictionary SET is_active= false WHERE category_id=$1",
    [category_id]
  );
  await pool.query(
    "INSERT INTO dictionary (is_active,file_data,category_id) VALUES (true,$1,$2)",
    [jsonDataString, category_id]
  );
});

module.exports = router;