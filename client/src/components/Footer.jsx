import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Importing assets
import Logo from './Logo';

const Footer = () => {
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  // Fetch Trending Blogs for the Footer
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
    fetchTrendingBlogs();
  }, []);

  return (
    <footer className="footer bg-dark-grey text-white py-8 mt-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Left section with Logo and Links */}
        <div className="flex flex-col">
          <Logo to="/" className="w-24 mb-4" />
          <p className="mb-4 text-sm text-grey">
            Your go-to blog for the latest in technology, lifestyle, and more.
          </p>
          <div className="space-y-3">
            <Link to="/about" className="link text-white">About</Link>
            <Link to="/contact" className="link text-white">Contact</Link>
            <Link to="/terms" className="link text-white">Terms</Link>
            <Link to="/privacy" className="link text-white">Privacy</Link>
          </div>
        </div>

        {/* Middle section with Recent Blog Posts */}
        <div>
          <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
          <ul className="space-y-2">
            {trendingBlogs === null ? (
              <li className="text-white">Loading trending blogs...</li>
            ) : trendingBlogs.length ? (
              trendingBlogs.slice(0, 4).map((blog) => (
                <li key={blog?.blog_id}>
                  <Link to={`/blog/${blog?.blog_id}`} className="link text-white hover:underline">
                    {blog?.title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-white">No trending blogs available</li>
            )}
          </ul>
        </div>

        {/* Right section with Newsletter Signup and Social Media */}
        <div className="flex flex-col items-start sm:items-center md:items-end">
          <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
          <form className="flex flex-col space-y-3 mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-full border-2 border-white bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
            >
              Subscribe
            </button>
          </form>

          <div className="flex space-x-4 justify-center md:justify-end">
            <a href="https://twitter.com" className="text-white text-2xl">
              <i className="fi fi-brands-twitter"></i>
            </a>
            <a href="https://facebook.com" className="text-white text-2xl">
              <i className="fi fi-brands-facebook"></i>
            </a>
            <a href="https://linkedin.com" className="text-white text-2xl">
              <i className="fi fi-brands-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom: Copyright & Legal Information */}
      <div className="text-center py-4 mt-8 border-t border-white text-sm text-grey">
        <p>&copy; 2025 Your Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
