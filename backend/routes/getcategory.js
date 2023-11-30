const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getcategory/:language_id", async (req, res) => {
  const language_id = req.params.language_id;
  try {
    const result = await pool.query(
      "SELECT name, category_id FROM category_id WHERE is_parent = true AND language_id =$1 AND is_active = true",
      [language_id]
    );

    const categoriesArray = result.rows.map((item) => {
      return {
        name: item.name,
        category_id: item.category_id,
      };
    });

    res.send(categoriesArray);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;