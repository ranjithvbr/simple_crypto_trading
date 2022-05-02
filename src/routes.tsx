import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home";
import Trade from "./pages/Trade";
import "./index.scss";

export default function Router() {

  return (
    <div className="App">
      <div className="contentContainer">
        <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
