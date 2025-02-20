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
              <div className=" flex max-sm:flex-col justify-between mt-8 ">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
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
                <h1 className="text-2xl mt-14 mb-10 font-medium">
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
