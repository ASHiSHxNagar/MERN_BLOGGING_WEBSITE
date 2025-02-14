import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import InpageNavigation from "../components/InpageNavigation";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import Blog from "./Blog";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";
import { useState } from "react";
import axios from "axios";
import filterPaginationData from "../common/FilterPaginationData";
import UserCard from "../components/UserCard";

const Search = () => {
  let { query } = useParams();

  let [blogs, setBlog] = useState(null);
  let [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });
        setBlog(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetState = () => {
    setBlog(null);
    setUsers(null);
  };

  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data: { users } }) => {
        setUsers(users);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <PageAnimation
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </PageAnimation>
            );
          })
        ) : (
          <Nodata message="No User Found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InpageNavigation
          routes={[`search Results for "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {blogs == null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
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
            <LoadMore state={blogs} fetchDataFun={searchBlogs} />
          </>

          <UserCardWrapper />
        </InpageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User releted to search <i className="fi fi-rr-user mt-1 "></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default Search;
