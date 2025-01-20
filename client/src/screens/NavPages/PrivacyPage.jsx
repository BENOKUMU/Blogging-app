import React from "react";

const PrivacyPage = () => {
  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
      </p>
      <ul className="mt-4 space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <li>
          <strong>1. Data Collection:</strong> We may collect personal information such as your name, email, and usage data.
        </li>
        <li>
          <strong>2. Data Usage:</strong> Your information is used to enhance your experience, provide services, and improve our platform.
        </li>
        <li>
          <strong>3. Data Protection:</strong> We implement security measures to safeguard your data against unauthorized access.
        </li>
      </ul>
      <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        For more details, refer to our full Privacy Policy document.
      </p>
      <div className="mt-8 text-center">
        <a href="/full-privacy" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300">
          Read Full Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default PrivacyPage;
