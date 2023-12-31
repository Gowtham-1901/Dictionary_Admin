import React, { useEffect, useState } from "react";
import { TextField, Switch, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import axios from "axios";

function DictionaryView({ ischanged, reloadView, setischanged }) {
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
          const initialToggleStates = res.data.map((item) => item.is_active);
          setToggleStates(initialToggleStates);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [ischanged, reloadView]);


  // const toggleSwitch = (index) => {
  //   const updatedToggleStates = [...toggleStates];
  //   updatedToggleStates[index] = !updatedToggleStates[index];
  //   setToggleStates(updatedToggleStates);
  // };

  const updateDataInDatabase = async(id, isactive) => {
    await axios
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

  // data.sort((a, b) => a.language_name.localeCompare(b.language_name));
  
  const indexOfLastItem = currentPage * 5;
  const indexOfFirstItem = indexOfLastItem - 5;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1); 
  
  console.log(currentItems);

  return (
    <>
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
        <Table sx={{ minWidth: 650, minHeight: 200 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Category</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Subcategory</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Language</TableCell>
              <TableCell sx={{ fontSize: '14px' }}></TableCell>
              <TableCell sx={{ fontSize: '14px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice((currentPage - 1) * 5, currentPage * 5)
              .map((item, index) => (
                <TableRow key={item.id} sx={{ minHeight: '10px' }} size="small">
                  <TableCell sx={{ textAlign: "left" }}>{item.parent_category_name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>{item.language_name}</TableCell>
                  <TableCell>
                    <Switch
                      onClick={() => {
                        updateDataInDatabase(
                          item.category_id,
                          !toggleStates[index + (currentPage - 1) * 5]
                        );
                        setischanged(!ischanged);
                      }}
                      checked={item.is_active}
                    />
                  </TableCell>
                  <TableCell>{toggleStates[index + (currentPage - 1) * 5] ? "Enabled" : "Disabled"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        </div>
      </div>
      
    </div>
    <div className="next_back">
    <Button className="back_button" sx={{ marginRight: 1, marginTop: 5.5 }} onClick={prevPage} disabled={currentPage === 1}>back</Button>
    <Button className="next_button" sx={{ marginRight: 1, marginTop: 5.5 }} onClick={nextPage} disabled={indexOfLastItem >= filteredData.length}>next</Button>
  </div>
  </>
  );
};

export default DictionaryView;
