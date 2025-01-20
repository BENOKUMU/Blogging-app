import React from "react";

const About = () => {
  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">About Us</h1>
      <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="mb-4">
          Welcome to our platform, your go-to destination for [purpose of the platform]. 
          We aim to provide users with [specific services or unique offerings]. 
          Our mission is to [mission statement].
        </p>
        <p className="mb-4">
          Whether you're here to [user goals], we are committed to delivering 
          a seamless and user-friendly experience. Thank you for being part of our journey.
        </p>
        <p className="mb-4">
          Our team is dedicated to constantly improving and evolving to meet your needs. 
          We value your feedback and are always here to assist you. Together, we can achieve great things.
        </p>
      </div>
      <div className="mt-8 text-center">
        <a href="/contact" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default About;