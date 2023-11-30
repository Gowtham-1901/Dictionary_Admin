const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getlanguage", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT language_name, language_id FROM language"
    );

    const languageArray = result.rows.map((item) => {
      return {
        language_name: item.language_name,
        language_id: item.language_id,
      };
    });

    res.send(languageArray);
  } catch (error) {
    console.error("Error getting languages:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;