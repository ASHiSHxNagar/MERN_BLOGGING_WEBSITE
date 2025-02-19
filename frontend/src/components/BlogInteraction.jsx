import React from "react";
import { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      blog_id,
      activity = {}, // Ensure activity is defined
      title,
      activity: { total_likes = 0, total_comments = 0 } = {}, // Ensure default values
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  const handelLike = () => {
    if (access_token) {
      //like the blog
      setIsLikedByUser((preVal) => !preVal);

      let updatedLikes = isLikedByUser ? total_likes - 1 : total_likes + 1;

      setBlog({
        ...blog,
        activity: { ...activity, total_likes: updatedLikes },
      });

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/liked-blog",
          {
            _id,
            isLikedByUser: !isLikedByUser,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //not logged in
      toast.error("Please login to like the blog");
    }
  };
  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handelLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "mt-1 fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")
              }
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className=" fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}

          <a
            href={`https://twitter.com/intent/tweet?text=Read ${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </a>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
