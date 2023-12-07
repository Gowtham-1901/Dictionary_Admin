import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./App.css";
import DictionaryView from "./dictionary_view";
import Topbar from "./topbar";
import Sidebar from "./sidebar";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

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
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [popup,setPopup] = useState(false);
  const [errors,setErrors]=useState({
    selectedLanguage: '',
    category: '',
    subcategory: '',
    excelFile: '',
  });
  const [fieldErrorPopup, setFieldErrorPopup] = useState(false);

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

  
  const openFieldErrorPopup = () => {
    setFieldErrorPopup(true);
    setTimeout(() => {
      setFieldErrorPopup(false);
    }, 3000);
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
          setErrors({
            ...newErrors,
            selectedLanguage: 'Data exists for the selected subcategory',
          });
          setPopup(true);
          openPopup()
        } else {
          handleFileSubmit();
          setSubmissionSuccess(true);
          setTimeout(() => {
          setSubmissionSuccess(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error while checking data existence:", error);
      }
    }else{
    setErrors(newErrors);
    openFieldErrorPopup();
  }
  };
                                                  
  const openPopup=() =>{
    setPopup(!popup);
  }
  const closePopup=() => {
    setPopup(!popup);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedLanguage("");
    setFileName("");
  }

  const handleFile = async(e) => {

    console.log("File Handling !!!")

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

    setTimeout(() => {
      e.target.value = null;
    }, 100);
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
      setSelectedLanguage("")
      setSelectedCategory("");
      setSelectedSubCategory("");
      setischanged(!ischanged);
    }
  };

  console.log(fileName)

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
    setSubcategories([])
    setCategories([])
    setischanged(!ischanged);
    setSubmissionSuccess(true);
          setTimeout(() => {
            setSubmissionSuccess(false);
          }, 3000);
  }
  }

  return (
    <div>
      <Topbar />
      <div className="dictionary">
        <Sidebar />
        <div className="table1">
          <div className="tables">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Language</TableCell>
                  <TableCell sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Category</TableCell>
                  <TableCell sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Subcategory</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <tbody>
                <TableRow>
                  <TableCell className="body_content">
                    <FormControl sx={{ width: '150px'}}>
                      <InputLabel>Select a language</InputLabel>
                      <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        error={errors.selectedLanguage}
                      >
                        <MenuItem value="">Select a language</MenuItem>
                        {language.map((lang, index) => (
                          <MenuItem key={index} value={lang.language_id}>
                            {lang.language_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell className="body_content">
                    <FormControl sx={{ width: '150px' }}>
                      <InputLabel>Select a category</InputLabel>
                      <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        error={errors.category}
                      >
                        <MenuItem value="">Select a category</MenuItem>
                        {categories.map((cat, index) => (
                          <MenuItem key={index} value={cat.category_id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell className="body_content">
                    <FormControl sx={{ width: '150px' }}>
                      <InputLabel>Select a subcategory</InputLabel>
                      <Select
                        value={selectedSubCategory}
                        onChange={handleSubCategoryChange}
                        error={errors.subcategory}
                      >
                        <MenuItem value="">Select a subcategory</MenuItem>
                        {subcategories.map((subcat, index) => (
                          <MenuItem key={index} value={subcat.category_id}>
                            {subcat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button onClick={HandleSubmit} className="submit_button">SUBMIT</Button>
                    {submissionSuccess && (
                      <div className="success-popup">
                        Submitted successfully!
                      </div>
                    )}

                    {fieldErrorPopup && (
                      <div className="field-error-popup">
                        Please select all the fields.
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              </tbody>
            </Table>
          </div>
          <div>
            <div className="submit_popup">
              {popup ?
                <div className="main">
                  <div className="popup">
                    <div className="popup_header">
                      <p className="popup_content">Are you sure you want to replace the existing file?</p>
                      <p className="x_button" onClick={closePopup}>x</p>
                    </div>
                    <div className="popup_footer">
                      <Button sx={{ marginTop: '20px', marginRight: '8px'}} onClick={handleExistFileSubmit} className="yes_button">Yes</Button>
                      <Button sx={{ marginTop: '20px', marginRight: '10px'}} className="no_button" onClick={closePopup}>No</Button>
                      {popup}
                    </div>
                  </div>
                </div> : ""}
            </div>
          </div>
          <div className="table2">
            <DictionaryView
              ischanged={ischanged}
              reloadView={reloadView}
              key={reloadView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dictionary;