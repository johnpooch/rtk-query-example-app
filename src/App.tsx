import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FeedbackWrapper from "./components/FeedbackWrapper";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";

const App = (): React.ReactElement => {
  return (
    <FeedbackWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </FeedbackWrapper>
  );
};

export default App;
