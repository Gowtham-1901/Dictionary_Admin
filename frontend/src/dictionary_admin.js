import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./App.css";
import DictionaryView from "./dictionary_view";
import Topbar from "./topbar";
import Sidebar from "./sidebar";

function Dictionary() {
  const [language, setLanguage] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [ischanged, setischanged] = useState("true");
  const [reloadView, setReloadView] = useState(false);
  const [, setexists] = useState(false);
  const [popup,setPopup] = useState(false);
  const [errors,setErrors]=useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9090/getlanguage")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLanguage(res.data);
          setFileName("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [ischanged]);

  const handleLanguageChange = (e) => {
    const selectedLanguageId = e.target.value;
    setSelectedLanguage(selectedLanguageId);
    axios
      .get(`http://localhost:9090/getcategory/${selectedLanguageId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          console.log(res.data)
        }else{
          setCategories([]);
        }
        setSelectedCategory("");
        setSelectedSubCategory("");
        setSubcategories([]);
        setErrors("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    axios
      .get(`http://localhost:9090/getsubcategory/${selectedCategoryId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSubcategories(res.data);
          setSelectedSubCategory("");
          setErrors("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSelectedSubCategory(selectedSubCategoryId);
    console.log(selectedSubCategoryId)
    setErrors("");
  };
  
  const HandleSubmit = async() => {
    let newErrors = {};
    if (selectedCategory === "") {
      newErrors.category = "Category is empty";
    }
    if (selectedSubCategory === "") {
      newErrors.subcategory = "Subcategory is empty";
    }
    if (selectedLanguage === "") {
      newErrors.selectedLanguage = "Language is empty";
    }
    if(excelFile === null){
      newErrors.excelFile = "File is not selected";
    } 
    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axios.get(`http://localhost:9090/checkDataExists/${selectedSubCategory}`);
  
        if (res.data.length > 0) {
          setPopup(true);
          openPopup()
        } else {
          handleFileSubmit();
        }
      } catch (error) {
        console.error("Error while checking data existence:", error);
      }
    }
    setErrors(newErrors);
  };
                                                  
  const openPopup=() =>{
    setPopup(!popup);
  }
  const closePopup=() => {
    setPopup(!popup);
    setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedLanguage("");
      setFileName("")
  }

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if(selectedFile) {
      if(fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
          setFileName(selectedFile.name);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = async (e) => {
    // e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const datas = XLSX.utils.sheet_to_json(worksheet);
      console.log(datas);

      function uploadData(datas, url) {
        const jsondata = datas;

        const data = {
          category_id: selectedSubCategory,
          jsonData: JSON.stringify(jsondata),
        };

        axios
          .put(url, data)
          .then((response) => {
            console.log("Axios Response: ", response.data);
            setReloadView(!reloadView);
          })
          .catch((error) => {
            console.error("Axios Error: ", error);
          });
      }
      
      uploadData(datas, "http://localhost:9090/updateData");
      setischanged(!ischanged);
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedLanguage("");
    }
  };

  const handleExistFileSubmit  = async (e) => {
    // e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const datas = XLSX.utils.sheet_to_json(worksheet);
      console.log(datas);
    function uploadData(datas, url) {
      const jsondata = datas;

      const data = {
        category_id: selectedSubCategory,
        jsonData: JSON.stringify(jsondata),
      };

      axios
        .put(url, data)
        .then((response) => {
          console.log("Axios Response: ", response.data);
          setReloadView(!reloadView);
        })
        .catch((error) => {
          console.error("Axios Error: ", error);
        });
    }
    uploadData(datas, "http://localhost:9090/updateExistingData");
    closePopup();
  }

  }

  return (  
      <div>
      <Topbar />
      <div className="dictionary">
        <Sidebar />
        <div className="table1">
          <div className="tables">
            <table>
              <thead>
                <th>Language</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th></th>
                <th></th>
              </thead>
              <tbody>
                <td className="body_content">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className={errors.selectedLanguage ? 'border-red' : ''}
                    >
                    <option value="">Select a language</option>
                    {language.map((lang, index) => (
                      <option key={index} value={lang.language_id}>
                        {lang.language_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="body_content">
                <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className={errors.category ? 'border-red' : ''}
                >
                <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="body_content">
                  <select
                    value={selectedSubCategory}
                    onChange={handleSubCategoryChange}
                    className={errors.subcategory ? 'border-red' : ''}
                    >
                    <option value="">Select a subcategory</option>
                    {subcategories.map((subcat, index) => (
                      <option key={index} value={subcat.category_id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <label htmlFor="file" className={`label ${errors.excelFile ? 'border-red' : ''}`}>
                    {fileName || "Upload file"}
                  </label>
                  <input 
                   className="input"
                    type="file"
                    accept=".xlsx"
                    id="file"
                    required
                    onChange={handleFile} 
                    
                  />
                  {typeError && <div role="alert">{typeError}</div>}
                </td>      
                <td>
                  <button onClick={HandleSubmit} className="submit_button">SUBMIT</button>
                </td>

              </tbody>
            </table>
          </div>
          <div>
            <div className="submit_popup">
              {popup?
              <div className="main">
                <div className="popup">
                  <div className="popup_header">
                    <p className="popup_content">Are you sure you want to replace the existing file?</p>
                    <p className="x_button" onClick={closePopup}>x</p>
                  </div>
                  <div className="popup_footer">
                    <button onClick={
                      handleExistFileSubmit}  className="yes_button">Yes</button>
                    <button className="no_button" onClick={closePopup}>No</button>
                    {popup}
                  </div>
                </div>
              </div>:""}
            </div>
          </div>
         
          <div className="table2">
            <DictionaryView
              ischanged={ischanged}
              reloadView={reloadView}
              key={reloadView}
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dictionary;