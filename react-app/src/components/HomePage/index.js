import React from "react";
import MainFeed from "./MainFeed";
import Sidebar from "./Sidebar";
import "./HomePage.css";

const HomePage = () => {
  return (
    <main className="page-container two-columns">
      <div className="mainfeed">
        <MainFeed />
      </div>
      <div className="sidebar">
        <Sidebar />
      </div>
    </main>
  );
};

export default HomePage;
