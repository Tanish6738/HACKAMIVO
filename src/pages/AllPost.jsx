import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";

const API_URL = "https://krish09bha-mindful-me-community.hf.space/api/posts";

const AllPost = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.id;

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  const fetchUserPosts = () => {
    axios
      .get(API_URL)
      .then((res) => {
        // Filter posts to only those authored by the logged-in user
        const filteredPosts = res.data.filter((post) => post.userId === userId);
        setUserPosts(filteredPosts);
      })
      .catch((err) => console.error(err));
  };

  if (!isLoaded) return <div>Loading user data...</div>;
  if (!isSignedIn)
    return <div>Please sign in to view your posts.</div>;

  if (userPosts.length === 0)
    return <div className="p-4 text-center">You have no posts yet.</div>;

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#F0F0F0] min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
      {userPosts.map((post) => (
        <div
          key={post._id}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={
                post.imageUrl
                  ? post.imageUrl
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      post.name
                    )}&background=random`
              }
              alt="Post Author"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{post.name}</p>
              <p className="text-xs text-gray-500">
                {moment(post.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <p className="text-gray-700 text-sm">{post.text}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags?.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllPost;
