import React from "react";
import { Link } from "react-router-dom";
import getDay from "../common/Date";

const MinimalBlogPost = ({ content2, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = content2;

  const datefunc = (timestamp) => {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div>
        <div className="flex gap-2 mb-5 items-center">
          <img src={profile_img} className="w-6 h-6 mt-1 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @ {username}
          </p>
          <p className="min-w-fit">{datefunc(content2.publishedAt)}</p>
        </div>
        <h1 className="blog-title ml-5 "> {title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
