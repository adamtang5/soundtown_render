import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GridDisplay from "../LibraryPage/Likes/GridDisplay";
import Avatar from "./Avatar";
import BackGroundImage from "./BackgroundHeader";
import "./userpage.css";
import "./user_page.scss";

function UserPage() {
  const { userId } = useParams();
  const songs = Object.values(useSelector((state) => state.songs));

  const likedSongs = songs?.filter((song) => song.likes.includes(+userId));

  return (
    <>
      <div> <BackGroundImage /> </div>
      <div> <Avatar /> </div>
      <div>
        <GridDisplay likedSongs={likedSongs} />
      </div>

    </>
  );
}
export default UserPage;
