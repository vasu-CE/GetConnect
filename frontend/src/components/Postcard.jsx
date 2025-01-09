import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Heart, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removePost } from "../redux/PostSlice";

const Postcard = ({post}) => {
  const user = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(post?.likes?.length);
  const [followed, setFollowed] = useState(false);
  const dispatch = useDispatch();

  // Check if the user already likes the post
  useEffect(() => {
    setLiked(post.likes?.includes(user._id));
  }, [post.likes, user._id]);

  useEffect(() => {
    const fetchFollowState = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/user/is-following/${post.author._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setFollowed(response.data.isFollowing);
        }
      } catch (err) {
        toast.error("Error fetching follow state");
      }
    };
    fetchFollowState();
  },[post.author?._id]);

  const likeHandler = async () => {
    // Optimistic update
    const newLikedState = !liked;
    const newCount = newLikedState ? count + 1 : count - 1;
  
    setLiked(newLikedState);
    setCount(newCount);
  
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/post/${post._id}/${newLikedState ? "like" : "dislike"}`,
        { withCredentials: true }
      );
  
      if (!response.data.success) {
        // Revert changes if the API fails
        setLiked(!newLikedState);
        setCount(newLikedState ? count - 1 : count + 1);
        toast.error("Failed to update like state");
      }
    } catch (err) {
      // Revert changes in case of an error
      setLiked(!newLikedState);
      setCount(newLikedState ? count - 1 : count + 1);
      toast.error("Error liking the post");
    }
  };
  

  const deletePostHandler = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Post deleted successfully");
        console.log(post._id)
        dispatch(removePost(post._id));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const followHandler = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/user/connection/${post.author._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setFollowed(response.data.following);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
            <MoreVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white border border-gray-200 shadow-md rounded-lg"
        >
          {post.author?._id === user._id ? (
            <DropdownMenuItem
              onClick={deletePostHandler}
              className="text-red-500 hover:text-red-700"
            >
              Delete Post
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={followHandler}
              className={`${
                followed
                  ? "text-red-500 hover:text-red-700"
                  : "text-green-500 hover:text-green-700"
              }`}
            >
              {followed ? "Unfollow" : "Follow"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center mb-4">
        <img
          src={post?.author?.profilePicture}
          alt="User"
          className="rounded-full w-10 h-10 object-cover mr-3 cursor-pointer"
          onClick={() => navigate(`/view/${post.author._id}/profile`)}
        />
        <div>
          <h4 className="text-gray-800 font-medium">
            {post.author?.userName || "John Doe"}
          </h4>
          <p className="text-gray-500 text-sm">{post?.time || "2 hours ago"}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-3">{post?.caption || "Caption"}</p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-auto rounded-lg mb-3 "
        />
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <button
          onClick={likeHandler}
          className="flex items-center space-x-1 hover:text-gray-800 transition"
        >
          {liked ? <Heart fill="red" strokeWidth={0} /> : <Heart />}
          <div className="text-black text-md">{count}</div>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-800 transition">
          <span>💬</span>
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-800 transition">
          <span>🔗</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Postcard;
