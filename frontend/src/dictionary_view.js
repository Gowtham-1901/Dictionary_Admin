import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";


function DictionaryView({ ischanged, reloadView }) {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState([]);
  const [Search,setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
          // Initialize toggle states based on data from the database
          console.log(res.data);

          const initialToggleStates = res.data.map((item) => item.is_active);
          setToggleStates(initialToggleStates);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [ischanged, reloadView]);

  const toggleSwitch = (index) => {
    const updatedToggleStates = [...toggleStates];
    updatedToggleStates[index] = !updatedToggleStates[index];
    setToggleStates(updatedToggleStates);
  };

  const updateDataInDatabase = (id, isactive) => {
    axios
      .put(`http://localhost:9090/isactive/${id}`, { isactive })
      .then((res) => {
        if (res.status === 200) {
          console.log("Data updated successfully in the database.");
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleChange = (event) => {
    const text = event.target.value;
    setSearch(text);
  }

  const filteredData =  data.filter(item =>
    Object.values(item).some(
      value =>
        typeof value === 'string' &&
        value.toLowerCase().includes(Search.toLowerCase())
    )
  );

  // Calculate the indexes for the slice in the filtered data
  const indexOfLastItem = currentPage * 7;
  const indexOfFirstItem = indexOfLastItem - 7;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page function
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1); 
  

  return (
    <div className="view_align">
    <div>
      <div className="title_bar">
      <h2 className="title">LIST OF DICTIONARY</h2>
      <div className="search_bar">
        <TextField
          id="outlined-basic"
          label="Search"
          value={Search}
          onChange={handleChange}
        />
        </div>
        </div>
      <div className="view_dictionary">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Language</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{item.parent_category_name}</td>
                <td>{item.category_name}</td>
                <td>{item.language_name}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={() => {
                        toggleSwitch(index);
                        updateDataInDatabase(
                          item.category_id,
                          !toggleStates[index]
                        );
                      }}
                      checked={toggleStates[index]}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>{toggleStates[index] ? "Enabled" : "Disabled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
    <div className="next_back">
    <button className="back_button" onClick={prevPage} disabled={currentPage === 1}>back</button>
    <button className="next_button" onClick={nextPage} disabled={indexOfLastItem >= filteredData.length}>next</button>
  </div>
  </div>
  );
}

export default DictionaryView;
