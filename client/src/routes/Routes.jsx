import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";  // Import Footer component

// Screens
import AuthForm from "../screens/AuthForm";
import Editor from "../screens/Editor";
import Home from "../screens/Home";
import Search from "../screens/Search";
import PageNotFound from "../screens/PageNotFound";
import UserProfile from "../screens/UserProfile";
import Blog from "../screens/Blog";
import SideNav from "../components/settings/SideNav";
import ChangePassword from "../screens/ChangePassword";
import EditProfile from "../screens/EditProfile";
import Notifications from "../screens/Notifications";
import ManageBlogs from "../screens/ManageBlogs";
import AdminAuth from "../screens/admin/AdminAuth";
import Blogs from "../screens/admin/Blogs";
import Users from "../screens/admin/Users";
import Reports from "../screens/admin/Reports";
import AdminNav from "../components/admin/AdminNav";
import About from "../screens/NavPages/About";      // Import new About page
import Contact from "../screens/NavPages/Contact";  // Import new Contact page
import Terms from "../screens/NavPages/TermsPage";      // Import new Terms page
import Privacy from "../screens/NavPages/PrivacyPage";  // Import new Privacy page

const Routes_ = () => {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:blogId" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />        {/* About page */}
          <Route path="contact" element={<Contact />} />    {/* Contact page */}
          <Route path="terms" element={<Terms />} />        {/* Terms page */}
          <Route path="privacy" element={<Privacy />} />    {/* Privacy page */}
          <Route path="dashboard" element={<SideNav />}>
            <Route path="notifications" element={<Notifications />} />
            <Route path="blogs" element={<ManageBlogs />} />
          </Route>

          <Route path="settings" element={<SideNav />}>
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="signin" element={<AuthForm type="sign-in" />} />
          <Route path="signup" element={<AuthForm type="sign-up" />} />
          <Route path="search/:query" element={<Search />} />
          <Route path="user/:id" element={<UserProfile />} />
          <Route path="blog/:blogId" element={<Blog />} />
          <Route path="*" element={<PageNotFound />} />

          <Route path="admin">
            <Route element={<AdminNav />}>
              <Route path="blogs" element={<Blogs />} />
              <Route path="users" element={<Users />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            <Route path="login" element={<AdminAuth />} />
          </Route>
        </Route>
      </Routes>
      
      {/* Footer component added globally */}
      <Footer />
    </Router>
  );
};

export default Routes_;
