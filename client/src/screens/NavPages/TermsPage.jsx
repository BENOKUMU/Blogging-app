import React from "react";

const TermsPage = () => {
  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">Terms and Conditions</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Welcome to our platform. Please read the following terms and conditions carefully before using our services.
      </p>
      <ul className="mt-4 space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <li>
          <strong>1. Use of Service:</strong> You must use the platform in compliance with all applicable laws.
        </li>
        <li>
          <strong>2. User Accounts:</strong> You are responsible for maintaining the confidentiality of your account credentials.
        </li>
        <li>
          <strong>3. Prohibited Activities:</strong> Any misuse of the platform, such as spamming, hacking, or unlawful activities, 
          is strictly prohibited.
        </li>
        <li>
          <strong>4. Content Ownership:</strong> All content provided on the platform is owned by us or our licensors and is protected by intellectual property laws.
        </li>
        <li>
          <strong>5. Termination:</strong> We reserve the right to terminate or suspend your account if you violate any of these terms.
        </li>
      </ul>
      <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        For the complete terms, please refer to our full Terms and Conditions document.
      </p>
      <div className="mt-8 text-center">
        <a href="/full-terms" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300">
          Read Full Terms
        </a>
      </div>
    </div>
  );
};

export default TermsPage;
