import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";

const ProfileSidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
 
  const CreateProfileNavigator = () => navigate("/profile/create");
  const EditNavigator = () => navigate("/profile/edit");

  return (
    <div className="w-full h-[80vh] bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col items-center space-y-3">
        {/* Profile Image */}
        <img
          src={user?.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover border-2 border-gray-200"
        />
        {/* Profile Name and Title */}
        <h3 className="text-xl font-medium text-gray-800">
          {user?.userName || "Guest User"}
        </h3>
        <p className="text-gray-500">{user?.bio || "No bio available."}</p>
        {/* Buttons */}
        <CreatePost />
        <Button
          onClick={CreateProfileNavigator}
          className="w-full bg-slate-200 text-gray-900 py-2 rounded-md mb-2 hover:bg-slate-300 transition-all"
        >
          Create a Profile
        </Button>
        <Button
          onClick={EditNavigator}
          className="w-full bg-slate-200 text-gray-900 py-2 rounded-md hover:bg-slate-300 transition-all"
        >
          Edit Profile
        </Button>
        
      </div>
    </div>
  );
};

export default ProfileSidebar;
