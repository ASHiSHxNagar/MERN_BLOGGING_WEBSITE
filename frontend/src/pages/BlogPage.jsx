import React, { useEffect, useState, createContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PageAnimation from "../common/PageAnimation";
import Loader from "../components/Loader";
import { getDay } from "../common/Date";
import BlogInteraction from "../components/BlogInteraction";
import Blog from "../components/Blog";
import BlogContent from "../components/BlogContent";

export const blogStructure = {
  title: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [showAd, setShowAd] = useState(true); // State to manage ad visibility
  const [showBlinkingAd, setShowBlinkingAd] = useState(true); // State to manage blinking ad visibility

  const closeAd = () => {
    setShowAd(false);
  };

  const closeBlinkingAd = () => {
    setShowBlinkingAd(false);
  };

  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-blog`, { blog_id })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        console.log(blog.content);
        axios
          .post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`, {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setLoading(false);
      });
  };

  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);

  return (
    <PageAnimation>
      {showAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="max-w-md p-8 text-center rounded-lg shadow-2xl bg-gradient-to-r from-purple-500 to-indigo-500">
            <h2 className="mb-6 text-2xl font-extrabold text-white">
              🎉 Limited Time Offer!
            </h2>
            <p className="mb-6 text-lg text-white">
              Upgrade to <strong>Premium Membership</strong> for only{" "}
              <span className="text-yellow-300">$30</span> instead of{" "}
              <span className="line-through">$60</span>!
            </p>
            <button
              onClick={closeAd}
              className="px-6 py-3 text-lg font-semibold text-purple-700 bg-yellow-300 rounded-full hover:bg-yellow-400"
            >
              Close Ad
            </button>
          </div>
        </div>
      )}

      {showBlinkingAd && (
        <div
          className="fixed z-50 p-2 text-sm font-bold text-white rounded-lg cursor-pointer bottom-5 right-5"
          style={{
            animation: "colorChange 0.2s infinite",
            backgroundColor: "red", // Initial color
          }}
        >
          <div className="flex items-center justify-between">
            <span>Remove Ads</span>
            <button
              onClick={closeBlinkingAd}
              className="flex items-center justify-center w-4 h-4 ml-2 text-xs font-bold text-black bg-white rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes colorChange {
            0% { background-color: red; }
            25% { background-color: blue; }
            50% { background-color: green; }
            75% { background-color: yellow; }
            100% { background-color: red; }
          }
        `}
      </style>

      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{ blog, setBlog, isLikedByUser, setIsLikedByUser }}
        >
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />

            <div className="mt-12">
              <h2>{title}</h2>
              <div className="flex justify-between mt-8 max-sm:flex-col">
                <div className="flex items-start gap-5">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="opacity-75 text-dark-grey max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction />

            <div className="my-12 font-gelasio blog-page-content">
              {Array.isArray(content) &&
                content.length > 0 &&
                content.map((block, i) => {
                  return (
                    <div key={i} className="my-4 md:my-8">
                      <BlogContent block={block} />
                    </div>
                  );
                })}
            </div>

            <BlogInteraction />
            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="mb-10 text-2xl font-medium mt-14">
                  Similar Blogs
                </h1>
                {similarBlogs.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;

                  return (
                    <PageAnimation
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <Blog content={blog} author={personal_info} index={i} />
                    </PageAnimation>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </PageAnimation>
  );
};

export default BlogPage;
