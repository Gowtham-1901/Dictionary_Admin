const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = new express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const addDataRoutes = require("./routes/addData");
const getcategoryRoutes = require("./routes/getcategory");
const getsubcategoryRoutes = require("./routes/getsubcategory");
const updateDataRoutes = require("./routes/updatedata");
const getlanguageRoutes = require("./routes/getLanguage");
const getDataRoutes = require("./routes/getData");
const isactiveRoutes = require("./routes/isactive");
const checkDataExistsRoutes = require("./routes/checkDataExists");
const updateExistingDataRoutes = require("./routes/updateExistingData");
const getDataBysubcategoryRoutes = require("./routes/getDataBysubcategory");
const getDataBycategoryRoutes = require("./routes/getDataByCategory");

app.post("/post", addDataRoutes);
app.get("/getcategory/:language_id", getcategoryRoutes);
app.get("/getsubcategory/:category_id", getsubcategoryRoutes);
app.put("/updatedata", updateDataRoutes);
app.get("/getlanguage", getlanguageRoutes);
app.get("/getData", getDataRoutes);
app.put("/isactive/:id", isactiveRoutes);
app.get("/checkDataExists/:category_id", checkDataExistsRoutes);
app.put("/updateExistingData", updateExistingDataRoutes);
app.get("/getDataBysubcategory/:category_id", getDataBysubcategoryRoutes);
app.get("/getDataByCategory/:category_id", getDataBycategoryRoutes);

module.exports = app;