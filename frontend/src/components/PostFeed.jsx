import React, { useEffect, useState } from 'react';
import Postcard from './Postcard';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/PostSlice';

function PostFeed({selectedInterests }) {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts) || []; // Ensure posts is always an array
    
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (pageNumber = 1) => {
        if (loading) return;
        // {console.log(selectedInterests?.length)}
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL}/post/allpost`,
                { userInterest: selectedInterests },
                {
                  params: { page: pageNumber, limit: 5 },
                  withCredentials: true,
                }
            );
            
            if (response.data.success) {
                if (pageNumber === 1) {
                  dispatch(setPosts(response.data.posts));
                } else {
                  dispatch(setPosts([...posts, ...response.data.posts]));
                }
                setHasMore(response.data.posts.length > 0);
              }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching posts');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        dispatch(setPosts([]));
    }, [selectedInterests, dispatch]);

    useEffect(() => {
      fetchPosts(page);
    }, [page, selectedInterests]);
    

    const loadMorePosts = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage);
    };

    return (
        <div className="flex flex-col gap-6 ml-[32vw] w-[34vw] mb-10">
            {posts.length > 0 ? (
                posts.map((post) => <Postcard key={post._id} post={post} />)
            ) : (
                <p>No posts available.</p>
            )}
            {hasMore && (
                <button
                    onClick={loadMorePosts}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mx-auto"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            )}
        </div>
    );
}

export default PostFeed;