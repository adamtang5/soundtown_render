import React from "react";
import MainFeed from "./MainFeed";
import Sidebar from "./Sidebar";
import "./HomePage.css";

const HomePage = () => {
  return (
    <main className="page-container two-columns flex-row">
      <div className="mainfeed_left_container">
        <MainFeed />
      </div>
      <div className="mainfeed_right_container">
        <Sidebar />
      </div>
    </main>
  );
};

export default HomePage;
