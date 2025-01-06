import React, { useEffect, useState } from 'react'
import Postcard from './Postcard';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/PostSlice';

function PostFeed() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true); // Set loading to true at the start of the fetch
        try {
          const response = await axios.get(`${import.meta.env.VITE_URL}/post/allpost`, {
            withCredentials: true,
          });
    
          if (response.data.success) {
            dispatch(setPosts(response.data.posts));
          }
        }catch (error) {
          toast.error(error.response?.data?.message || "Error fetching posts");
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    },[dispatch])

    if (loading) {
      return <div className="flex items-center justify-center text-2xl h-[80vh]">Loading...</div>;
    }
    
    return (
      <div className="flex flex-col gap-6 ml-[32vw] w-[34vw]">
        {posts?.length > 0 ? (
        posts.map((post) => <Postcard key={post._id} post={post}/>)
      ) : (
        <p>No posts available.</p>
      )}
      </div>
    );
}

export default PostFeed