const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/getsubcategory/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;

    if (category_id) {
      // Fetch distinct subcategories based on the obtained category_id
      const result = await pool.query(
        "SELECT  name, category_id FROM category_id WHERE parent_id = $1 AND is_active = true",
        [category_id]
      );

      const subcategoriesArray = result.rows.map((item) => {
        return {
          name: item.name,
          category_id: item.category_id,
        };
      });

      res.send(subcategoriesArray);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.error("Error getting subcategories:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;