import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginSignupForm from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import CreateProfile from './components/CreateProfile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import ProfilePage from './components/ProfilePage';
import Quiz from './components/Quiz';
import Projects from './components/Projects';
import ProjectPage from './components/ProjectPage';
// import UserAuth from './auth/userAuth';
import UserAuth from './auth/UserAuth.jsx';

// Create a wrapper component to conditionally render Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't show navbar on login page (root path)
  return location.pathname !== '/' ? <Navbar /> : null;
};

function App() {
  return (  
    <Router>
      <NavbarWrapper />
      <div className=" pt-4"> {/* Removed pt-10 since we don't need it on login page */}
        <Routes>
          <Route path="/" element={<LoginSignupForm />} />
          <Route path="/home" element={<UserAuth><Home /></UserAuth>} />
          <Route path="/profile/create" element={<UserAuth><CreateProfile /></UserAuth>} />
          <Route path="/profile/edit" element={<UserAuth><EditProfile /></UserAuth>} />
          <Route path="/render/chat/:id" element={<UserAuth><ChatPage /></UserAuth>} />
          <Route path="/view/:id/profile" element={<UserAuth><ProfilePage /></UserAuth>} />
          <Route path="/quiz" element={<UserAuth><Quiz /></UserAuth>} />
          <Route path="/projects" element={<UserAuth><Projects /></UserAuth>} />
          <Route path="/project/:id" element={<UserAuth><ProjectPage /></UserAuth>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
