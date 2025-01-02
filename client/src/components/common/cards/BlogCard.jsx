import { Link } from "react-router-dom";
import { getDate } from "../../../utils/getDate";

const BlogCard = ({ blog, author }) => {
  const {
    title,
    des,
    banner,
    tags,
    publishedAt,
    activity: { total_likes },
    blog_id: id,
  } = blog;

  const { fullName, username, profile_img } = author;

  return (
    <Link to={`/blog/${id}`} className="flex gap-8 items-center border-b border-grey pb-4 mb-4">
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img
            className="w-6 h-6 rounded-full"
            src={profile_img || "/default-profile.jpg"} // Ensure fallback if no profile image
            alt={fullName}
          />
          <p className="line-clamp-1">{fullName} @{username}</p>
          <p className="min-w-fit">{getDate(publishedAt)}</p>
        </div>

        <h1 className="text-xl font-semibold text-black dark:text-white">{title}</h1>
        
        {/* Show more description text on larger screens */}
        <p className="my-3 text-lg font-gelasio leading-7 line-clamp-3">
          {des}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>

      {/* Blog banner image */}
      <div className="h-28 aspect-square bg-grey">
        <img
          className="w-full h-full aspect-square object-cover"
          src={banner || "/default-banner.jpg"} // Ensure fallback if no banner
          alt={title}
        />
      </div>
    </Link>
  );
};

export default BlogCard;
