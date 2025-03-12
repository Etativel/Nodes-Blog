import { Link } from "react-router-dom";
import "../styles/PostCard.css";
import profile from "../assets/img/cat.jpg";
// import { useEffect, useState } from "react";
import { useAuthor } from "../utils/useAuthor";
function PostCard({
  authorId,
  postTitle,
  postSubtext,
  postDate,
  postComment,
  postId,
}) {
  const { author, loading, error } = useAuthor(authorId);
  // const [username, setUsername] = useState("")
  // useEffect(()=>{
  //   async function getUsername(){
  //     try {
  //       const response =await fetch()
  //     }
  //   }
  // console.log(author);
  // })
  const formattedDate = new Date(postDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleClick = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  };

  return (
    <Link
      className="postcard-container"
      to={`/post/${postId}`}
      onClick={handleClick}
    >
      <div className="top">
        <div className="left">
          <div className="profile">
            <img src={profile} alt="profile-pict" className="author-pict" />
            <span className="author-name">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : author?.username || authorId}
            </span>
          </div>
          <div className="post-title">{postTitle}</div>
          <div className="post-subtext">{postSubtext}</div>
        </div>
        <div className="right">
          <img src={profile} alt="" className="post-header-img" />
        </div>
      </div>
      <div className="bottom">
        <div className="post-info">
          <div className="left-info">
            <div className="date">{formattedDate}</div>
            <div className="comment">{postComment.length}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
