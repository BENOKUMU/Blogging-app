import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/GlobalContext";
import { getDate } from "../utils/getDate";

const Banner = ({ blog, author }) => {
  const { theme } = useStateContext();

  // State to track the banner index
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Safely destructure only if blog is available
  if (!blog) return null;

  const { title, des, banner, tags, publishedAt, activity, blog_id: id } = blog;

  // Safely destructure author properties
  const { fullName, username, profile_img } = author || {};

  // Safely access the total_likes property using optional chaining (?.)
  const totalLikes = activity?.total_likes || 0;

  // Set up an interval to randomly change the banner every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % (blog?.results?.length || 1));
    }, 5000); // Change every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [blog?.results?.length]); // Only restart interval if the blog length changes

  return (
    <div className="w-full mb-10">
      <div className="relative w-full h-[500px] 2xl:h-[600px] flex px-0 lg:px-20">
        <Link to={`/blog/${id}`} className="w-full">
          {banner ? (
            <img
              src={banner}
              alt={title}
              className="w-full md:w-3/4 h-64 md:h-[420px] 2xl:h-[560px] rounded"
            />
          ) : (
            <div className="w-full h-[420px] 2xl:h-[560px] bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">No Banner Available</span>
            </div>
          )}
        </Link>

        <div className="absolute flex flex-col md:right-10 bottom-10 md:bottom-2 w-full md:w-2/4 lg:w-1/3 2xl:w-[480px] bg-white dark:bg-[#9daecb] shadow-2xl p-5 rounded-lg gap-3">
          <div className="flex gap-2 items-center mb-7">
            <img
              className="w-6 h-6 rounded-full"
              src={profile_img || "/default-profile.jpg"} // Fallback if profile_img is undefined
              alt={fullName || "Author"}
            />
            <p className={`line-clamp-1 ${theme === "dark" ? "text-white" : "text-black"}`}>
              {fullName || "Unknown Author"} @{username || "Unknown"}
            </p>
            <p className={`min-w-fit ${theme === "dark" ? "text-white" : "text-black"}`}>
              {getDate(publishedAt)}
            </p>
          </div>

          <Link to={`/blog/${id}`}>
            <h1
              className={`font-semibold text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {title}
            </h1>
            <img
              src={banner}
              alt={title}
              className="w-full h-auto max-h-[50px] object-cover rounded"
            />
          </Link>

          <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
            {des}
          </p>

          <div className="flex gap-4 mt-7">
            <span className="btn-light py-1 px-4">{tags?.[0] || "No Tag"}</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <i className="fi fi-rr-heart text-xl"></i>
              {totalLikes}
            </span>
          </div>

          <Link
            to={`/blog/${id}`}
            className="w-fit bg-rose-600 bg-opacity-20 text-rose-700 px-4 py-1 rounded-full text-sm cursor-pointer"
          >
            Read more...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
