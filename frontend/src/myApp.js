import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dictionary from "./dictionary_admin";
import DictionaryView from "./dictionary_view";
import DictionaryPop from "./dictionary_pop";

function MyApp() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/dictionary-admin" element={<Dictionary />} />
          <Route path="/dictionary-view" element={<DictionaryView />} />
          <Route path="/dictionary" element={<DictionaryPop />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default MyApp;
