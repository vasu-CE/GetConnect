import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";
import { FileUser, Images, Sparkles, University } from "lucide-react";

const ProfilePage = () => {
  const author = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/view/${id}/profile`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setUser(response.data.author);
          console.log(user);
          setPosts(response.data.posts);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProfile();
  }, [id]);

  const resumeHandeler = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/render/resume/${id}`
      );
      if (response.data.success) {
        const resumeData = response.data.resumeImg;
        const newTab = window.open();
        newTab.document.write(
          '<iframe src="' +
            resumeData +
            '" width="100%" height="100%" style="border:none;"></iframe>'
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const navigate = useNavigate();
  const messageHandeler = () => {
    navigate(`/render/chat/${id}`);
  };

  const formatTimeDifference = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - postDate;

    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl w-full overflow-hidden">
      {/* Profile Header */}
      <div
        className="relative text-gray-900 p-8 flex justify-center flex-col sm:flex-row items-center gap-6"
        style={{
          backgroundImage: "url('/bg.png')", // Path to your background image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={user?.profilePicture || "defaultProfilePic.jpg"}
          alt="Profile"
          className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover"
        />
        <div>
          <h1 className="text-3xl font-semibold">{user?.userName}</h1>
          <p className="text-lg mt-2">{user?.bio || "No bio available."}</p>
          <p className="font-bold mt-1">Score : {user?.score || 0}</p>
          <p className="text-sm mt-1">
            <strong>Connections:</strong> {user?.connection?.length || 0}
          </p>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[2vw] ml-[37vw] p-6 border-t-2 border-gray-100">
        {author._id === id && (
          <CreatePost className="bg-blue-600 w-[10vw] text-white hover:bg-blue-500 transition-all rounded-lg px-6 py-3 text-lg" />
        )}
        <Button
          onClick={messageHandeler}
          className="bg-transparent text-gray-800 hover:bg-gray-100 border-2 border-gray-800 rounded-lg px-6 py-3 text-lg"
        >
          Message
        </Button>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8">
        {/* Education */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex gap-2 items-center">
            <University color="blue" />
            Education
          </h2>
          <p className="mt-2 text-gray-600">Charusat University</p>
        </div>

        {/* Resume */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex gap-2 items-center">
            <FileUser color="blue" />
            Resume
          </h2>
          {user?.resume ? (
            <Button
              onClick={resumeHandeler}
              className="mt-4 bg-blue-700 text-white hover:bg-blue-600 transition-all px-6 py-3 rounded-lg"
            >
              View Resume
            </Button>
          ) : (
            <div className="pt-2 text-gray-600">No resume Available</div>
          )}
        </div>
      </div>

      {/* Interests */}
      <div className="p-8 ml-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex gap-2 items-center">
          <Sparkles color="blue" />
          Interests
        </h2>
        <div className="flex flex-wrap gap-4">
          {user?.interests?.length ? (
            user?.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition-all"
              >
                {interest}
              </span>
            ))
          ) : (
            <span className="text-gray-600">No interests available.</span>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex gap-2 items-center">
          <Images color="blue" />
          Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800">
                    {user.userName}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {post.caption || "No caption"}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {post?.createdAt ? formatTimeDifference(post.createdAt) : "Unknown time"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <span className="text-gray-600">No posts available.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
