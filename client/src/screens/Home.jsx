import { useEffect, useState } from "react";
import axios from "axios";

// functions
import { filterPaginationData } from "../functions";

// components
import AnimationWrapper from "../components/common/AnimationWrapper";
import InPageNavigation, {
  activeTabRef,
} from "../components/common/InPageNavigation";
import Banner from "../components/Banner";
import Loader from "../components/common/Loader";
import BlogCard from "../components/common/cards/BlogCard";
import MinimalBlogPostCard from "../components/common/cards/MinimalBlogPostCard";
import NodataMessage from "../components/common/NodataMessage";
import LoadMoreBtn from "../components/common/buttons/LoadMoreBtn";
import { useStateContext } from "../contexts/GlobalContext"; // import context to check theme

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  const categories = [
    "tech",
    "programming",
    "linux",
    "kde plasma",
    "github",
    "new dev",
    "hello",
    "test",
    "card",
  ];

  const {
    theme, // access the theme from the context
  } = useStateContext();

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(`/api/v1/blogs/latest`, { page })
      .then(async ({ data }) => {
        const formattedData = await filterPaginationData({
          state: blogs,
          data: data?.blogs,
          page,
          countRoute: "blogs/latest/total-posts",
        });
        setBlogs(formattedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(`/api/v1/blogs/search`, { tag: pageState, page })
      .then(async ({ data }) => {
        const formattedData = await filterPaginationData({
          state: blogs,
          data: data?.blogs,
          page,
          countRoute: "blogs/search/total-posts",
          dataToSend: { tag: pageState },
        });
        setBlogs(formattedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(`/api/v1/blogs/trending`)
      .then(({ data }) => {
        setTrendingBlogs(data?.blogs);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  const handleLoadCategory = (event) => {
    const category = event.target.innerText.toLowerCase();
    setBlogs(null);

    if (pageState === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  // Only calculate random index if blogs are available
  const randomIndex = blogs
    ? Math.floor(Math.random() * blogs.results.length)
    : 0;

  return (
    <AnimationWrapper>
      <section
        className={`h-cover flex flex-col gap-10 ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {/* Banner Section (Positioned at the top) */}
        {blogs && blogs.results.length > 0 && (
          <Banner
            blog={blogs.results[randomIndex]}
            author={blogs.results[0]?.author?.personal_info}
          />
        )}

        {/* Main Content Section */}
        <div className="flex justify-between w-full">
          {/* Left side: Home content (Blogs) */}
          <div className="w-[60%]">
            <InPageNavigation
              routes={[pageState, "trending blogs"]}
              defaultHidden={["trending blogs"]}
            >
              <>
                {blogs === null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, index) => (
                    <AnimationWrapper
                      key={blog?.blog_id}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <BlogCard
                        blog={blog}
                        author={blog?.author?.personal_info}
                      />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NodataMessage message="No blog published" />
                )}

                <LoadMoreBtn
                  state={blogs}
                  fetchDataFunc={
                    pageState === "home"
                      ? fetchLatestBlogs
                      : fetchBlogsByCategory
                  }
                />
              </>
              {/* Trending blogs only for md devices */}
              {trendingBlogs === null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, index) => (
                  <AnimationWrapper
                    key={blog?.blog_id}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  >
                    <MinimalBlogPostCard blog={blog} index={index} />
                  </AnimationWrapper>
                ))
              ) : (
                <NodataMessage message="No trending blogs published" />
              )}
            </InPageNavigation>
          </div>

          {/* Right side: Filters and Trending Blogs */}
          <div
            className={`w-[35%] border-l border-grey pl-8 pt-3 max-md:hidden ${
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="font-medium text-xl mb-8 text-gray-800">
                  Stories from all interests
                </h1>
                <div className="flex gap-3 flex-wrap">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`tag ${
                        pageState === category
                          ? "bg-black text-white"
                          : "text-black"
                      }`}
                      onClick={handleLoadCategory}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h1 className="font-medium text-xl mb-8 text-white">
                  Trending <i className="fi fi-rr-arrow-trend-up"></i>
                </h1>
                {trendingBlogs === null ? (
                  <Loader />
                ) : trendingBlogs.length ? (
                  trendingBlogs.map((blog, index) => (
                    <AnimationWrapper
                      key={blog?.blog_id}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <MinimalBlogPostCard blog={blog} index={index} />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NodataMessage message="No trending blogs published" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
