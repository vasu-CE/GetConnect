import React from 'react';
import PostFeed from './PostFeed.jsx';
import ProfileSidebar from './ProfileSidebar';
import Community from './Community';

function Home() {
  return (
    <div className="flex bg-slate-200 min-h-screen overflow-hidden mt-4">
      {/* Left Sidebar (Profile) */}
      <div className="fixed w-1/5  p-6 rounded-lg  h-screen">
        <ProfileSidebar />
      </div>

      {/* Middle Content (Scrollable Posts Section) */}
      <div className="flex-1 ml-1/5 mr-1/5 p-6 mt-2  h-screen overflow-y-auto">
        <PostFeed />
      </div>

      {/* Right Sidebar (Community) */}
      <div className="fixed right-0 w-1/5 p-6 rounded-lg h-screen">
        <Community />
      </div>
    </div>
  );
}

export default Home;
