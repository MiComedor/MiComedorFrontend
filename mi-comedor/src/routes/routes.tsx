import React from "react";
import {Routes, Route} from "react-router-dom";

import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Profile from "../components/Profile";
import BoardUser from "../components/BoardUser";
import BoardModerator from "../components/BoardModerator";
import BoardAdmin from "../components/BoardAdmin";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/user" element={<BoardUser />} />
      <Route path="/mod" element={<BoardModerator />} />
      <Route path="/admin" element={<BoardAdmin />} />
    </Routes>
  );
};

export default AppRoutes;
