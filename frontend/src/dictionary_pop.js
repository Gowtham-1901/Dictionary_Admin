import React, { useEffect, useState } from "react";
import axios from "axios";

function DictionaryPop() {
  const [data, setData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subcategoryFilter, setSubcategoryFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [subcategories, setSubcategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/getData")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const data = res.data.filter(
            (item) => item.isactive === true || item.isactive === null
          );
          setData(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const filteredSubcategories = [
      ...new Set(
        data
          .filter((item) => item.category === categoryFilter)
          .map((item) => item.subcategory)
      ),
    ];
    setSubcategories(filteredSubcategories);
  }, [categoryFilter, data]);
  useEffect(() => {
    if (categoryFilter !== "All") {
      const filteredSubcategories = [
        ...new Set(
          data
            .filter((item) => item.category === categoryFilter)
            .map((item) => item.subcategory)
        ),
      ];
      setSubcategories(filteredSubcategories);
    } else {
      setSubcategories([]);
      setSubcategoryFilter("All"); // Reset subcategory filter when category is "All"
    }

    setFilteredData(
      data.filter((item) => {
        return (
          (categoryFilter === "All" || item.category === categoryFilter) &&
          (subcategoryFilter === "All" ||
            item.subcategory === subcategoryFilter) &&
          (languageFilter === "All" || item.language_name === languageFilter)
        );
      })
    );
  }, [categoryFilter, subcategoryFilter, languageFilter, data]);

  const handleFilter = (e) => {
    const inputValue = e.target.value.toLowerCase();

    const filteredResult = data.map((item) => ({
      ...item,
      data: item.data.filter(
        (entry) =>
          entry.original_word.toLowerCase().startsWith(inputValue) &&
          (categoryFilter === "All" || item.category === categoryFilter) &&
          (subcategoryFilter === "All" ||
            item.subcategory === subcategoryFilter) &&
          (languageFilter === "All" || item.language_name === languageFilter)
      ),
    }));

    setFilteredData(filteredResult);
  };

  return (
    <div>
      <p>DICTIONARY</p>
      <div className="dictionary">
        <label>
          Category:
          <select
            onChange={(e) => {
              setCategoryFilter(e.target.value);
            }}
          >
            <option value="All">All</option>
            {[...new Set(data.map((item) => item.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subcategory:
          <select onChange={(e) => setSubcategoryFilter(e.target.value)}>
            <option value="All">All</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </label>

        <br></br>
        <br></br>
        <label>
          Language:
          <select onChange={(e) => setLanguageFilter(e.target.value)}>
            <option value="All">All</option>
            {[...new Set(data.map((item) => item.language_name))].map(
              (language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              )
            )}
          </select>
        </label>
        <br></br>
        <br></br>
        <label>
          Search <input type="text" onChange={(e) => handleFilter(e)}></input>
        </label>
        <table>
          <thead>
            <tr>
              <th>ORIGINAL WORD</th>
              <th>TRANSLATED WORD</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) =>
              item.data.map((entry, subIndex) => (
                <tr key={item + "-" + entry}>
                  <td>{entry.original_word}</td>
                  <td>{entry.translated_word}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DictionaryPop;
