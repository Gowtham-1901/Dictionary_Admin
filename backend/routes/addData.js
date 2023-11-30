const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/post", async (req, res) => {
  const { jsonData, category, subcategory, language } = req.body;

  // Stringify the JSON data
  const jsonDataString = JSON.stringify(jsonData);

  const result = await pool.query(
    `SELECT language_id FROM language WHERE language_name=$1`,
    [language]
  );
  const language_id = result.rows[0].language_id;
  const insertQuery = `INSERT INTO dictionary_table (data, category, subcategory,language_id) VALUES ($1, $2, $3,$4)`;

  try {
    const result = await pool.query(insertQuery, [
      jsonDataString,
      category,
      subcategory,
      language_id,
    ]);
    res.send("Data received and processed.");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error processing data.");
  }
});

module.exports = router;
