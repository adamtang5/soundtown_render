import React from "react";
import MainFeed from "../components/HomePage/MainFeed";
import Sidebar from "../components/HomePage/Sidebar";
import "./Home.css";

const Home = () => {
  return (
    <main className="container two-columns">
      <div className="mainfeed">
        <MainFeed />
      </div>
      <div className="sidebar">
        <Sidebar />
      </div>
    </main>
  );
};

export default Home;
