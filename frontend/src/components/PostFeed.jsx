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
      return (
      <>
        {Array.from({length : 5 }).map((_,i) => (
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 relative animate-pulse ml-[32vw] w-[34vw]">
             <div class="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-200"></div>
               
             <div class="flex items-center mb-4 animate-pulse">
               <div class="rounded-full w-10 h-10 bg-gray-200 mr-3"></div>
               <div>
                 <div class="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                 <div class="h-3 bg-gray-200 rounded w-20"></div>
               </div>
             </div>
               
             <div class="h-3 bg-gray-200 rounded w-full mb-3"></div>
               
             <div class="bg-gray-200 rounded-lg w-full h-56 mb-3"></div>
               
             <div class="flex items-center justify-between text-sm text-gray-500 animate-pulse">
               <div class="flex items-center space-x-1">
                <div class="h-6 w-6 rounded-full bg-gray-200 mr-2"></div>
                <div class="w-6 h-3 bg-gray-200 rounded"></div>
               </div>
               <div class="flex items-center space-x-1">
                 <div class="w-6 h-3 bg-gray-200 rounded mr-2"></div>
                 <div class="w-6 h-3 bg-gray-200 rounded"></div>
               </div>
               <div class="flex items-center space-x-1">
                 <div class="w-6 h-3 bg-gray-200 rounded mr-2"></div>
                 <div class="w-6 h-3 bg-gray-200 rounded"></div>
               </div>
             </div>
          </div>
        ))} 
      </>)
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