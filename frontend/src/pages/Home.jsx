import React, { useEffect, useState } from "react";
import PageAnimation from "../common/PageAnimation";
import InpageNavigation from "../components/InpageNavigation";
import axios from "axios";
import Loader from "../components/Loader";
import Blog from "./Blog";
import MinimalBlogPost from "../components/NobanneBlogPost";
import { activeTabLineRef, activeTabRef } from "../components/InpageNavigation";
import Nodata from "../components/Nodata";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "programming",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finance",
    "anime",
    "girl",
  ];

  const fetchLatestBlogs = (page = 1) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(({ data }) => {
        // let formatData =
        // setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchBlogsByCategory = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
      })
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState == "home") {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory();
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <PageAnimation>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InpageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.length ? (
                blogs.map((blog, i) => {
                  return (
                    <PageAnimation
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <Blog content={blog} author={blog.author.personal_info} />
                    </PageAnimation>
                  );
                })
              ) : (
                <Nodata message="No blogs found" />
              )}
            </>
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <PageAnimation
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost content2={blog} index={i} />
                  </PageAnimation>
                );
              })
            ) : (
              <Nodata message="No trending blogs found" />
            )}
          </InpageNavigation>
        </div>
        {/* filters and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10 mb-10">
            <div>
              <h1 className="font-medium text-xl mb-8 ">
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      key={i}
                      className={
                        "tag " +
                        (pageState == category ? "bg-black text-white" : " ")
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="">
            <h1 className="font-medium text-xl mb-8">
              Trending
              <i className="fi fi-rr-arrow-trend-up"></i>
            </h1>
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <PageAnimation
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost content2={blog} index={i} />
                  </PageAnimation>
                );
              })
            ) : (
              <Nodata message="No trending blogs found" />
            )}
          </div>
        </div>
      </section>
    </PageAnimation>
  );
};

export default HomePage;
