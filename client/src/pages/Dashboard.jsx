import React, { useState, useRef } from "react";
import CanvasBoard from "../components/CanvasBoard";
import Controls from "../components/Controls";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [points, setPoints] = useState([]);
  const canvasRef = useRef();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Smart Canvas Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <CanvasBoard ref={canvasRef} setPoints={setPoints} />
      <Controls points={points} canvasRef={canvasRef} />
    </div>
  );
};

export default Dashboard;