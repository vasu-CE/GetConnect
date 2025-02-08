import React, { useState } from 'react';
import PostFeed from './PostFeed.jsx';
import ProfileSidebar from './ProfileSidebar';
import Community from './Community';

function Home() {
  const [selectedInterests, setSelectedInterests] = useState([])
  return (
    <div className="flex bg-slate-200 min-h-screen overflow-hidden mt-4">
      
      <div className="fixed w-1/5  p-6 rounded-lg  h-screen">
        <ProfileSidebar />                
      </div>

      <div className="flex-1 ml-1/5 mr-1/5 p-6 mt-2  h-screen overflow-y-auto">
        <PostFeed selectedInterests={selectedInterests} />
      </div>

      <div className="fixed right-0 w-1/5 p-6 rounded-lg h-screen">
        <Community
         selectedInterests={selectedInterests}
         setSelectedInterests={setSelectedInterests}
        />
      </div>
    </div>
  );
}

export default Home;
