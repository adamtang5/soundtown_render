import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../../store/comment";
import SingleSongHeader from "./SingleSongHeader";
import NewCommentForm from "./Comments/NewCommentForm";
import SongButtonGroup from "./SongButtonGroup";
import Avatar from "../../Icons/Avatar";
import SongComments from "./SongComments";
import "./SingleSong.css";

const SingleSong = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[+id]);
  const sessionUser = useSelector(state => state.session.user);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();

    const comment = {
      user_id: sessionUser.id,
      song_id: song.id,
      content,
    };
    const data = dispatch(createComment(comment));
    if (data.errors) {
      setErrors(data.errors);
    } else {
      setContent("");
    }
  };

  return (
    <>
      <SingleSongHeader song={song} />
      <div className="page-container single-song-secondary flex-row">
        <main className="single-song-main">
          <NewCommentForm
            handleNewCommentSubmit={handleNewCommentSubmit}
            content={content}
            setContent={setContent}
            errors={errors}
          />
          <SongButtonGroup song={song} />
          <section className="comment-two-columns flex-row">
            <aside>
              <article className="user-badge flex-column">
                <Avatar user={song?.user} isLink={true} />
                <footer>
                  <Link to={`/users/${song?.user_id}`}>
                    {song?.user?.display_name}
                  </Link>
                </footer>
              </article>
            </aside>
            <SongComments song={song} />
          </section>
        </main>
        <aside>{/* TODO: Sidebar goes here */}</aside>
      </div>
    </>
  );
};

export default SingleSong;
