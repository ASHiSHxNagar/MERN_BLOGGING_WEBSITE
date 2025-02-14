import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PageAnimation from "../common/PageAnimation";
import Loader from "../components/Loader";
import { UserContext } from "../App";
import About from "../components/About";
import filterPaginationData from "../common/FilterPaginationData";
import InpageNavigation from "../components/InpageNavigation";
import Blog from "./Blog";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";
import PageNotFound from "./404";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_image: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_blogs: 0,
  },
  social_links: {},
  joined_at: "",
};

const Profile = () => {
  let { id: profileId } = useParams();

  let [profile, setProfile] = useState(profileDataStructure);

  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState("");
  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let {
    userAuth: { username },
  } = useContext(UserContext);

  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (user != null) {
          setProfile(user);
        }
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id }); // Corrected user_id
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });

        formattedData.user_id = user_id;

        setBlogs(formattedData);
      });
  };

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  useEffect(() => {
    if (profileId != profileLoaded) {
      setBlogs(null);
    }

    if (blogs == null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  return (
    <PageAnimation>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]  md:w-[50%] md:pl-8 md:border-l border-grey md:sticky  md:top-[100px] md:py-10">
            <img
              src={profile_img}
              className="w-40 h-40 bg-grey rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-medium ">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} - Reads
            </p>

            <div className="flex gap-4 mt-2 ">
              {profileId == username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                ""
              )}
            </div>

            <About
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InpageNavigation
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
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
                        <Blog
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </PageAnimation>
                    );
                  })
                ) : (
                  <Nodata message="No blogs found" />
                )}
                <LoadMore state={blogs} fetchDataFun={getBlogs} />
              </>

              <About
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InpageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </PageAnimation>
  );
};

export default Profile;
