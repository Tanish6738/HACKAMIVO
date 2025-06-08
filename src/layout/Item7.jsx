// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useUser } from '@clerk/clerk-react';
// import moment from 'moment';
// import {
//   FaEdit,
//   FaTrash,
//   FaHeart,
//   FaComment,
//   FaBookmark,
//   FaRegBookmark,
//   FaReply,
//   FaCheck,
//   FaTimes,
// } from 'react-icons/fa';
// // https://mindfullme-update-q1z8.onrender.com
// const API_URL = "https://krish09bha-mindful-me-community.hf.space/api/posts";

// const PostCard = ({
//   post,
//   isUserPostTab,
//   userId,
//   userName,
//   editingPostId,
//   editPostText,
//   setEditPostText,
//   handleEditPost,
//   handleEditPostSave,
//   handleEditPostCancel,
//   handleDeletePost,
//   likedPosts,
//   handleLike,
//   savedMap,
//   handleSave,
//   commentInputs,
//   handleCommentChange,
//   handleCommentSubmit,
//   replyInputs,
//   setReplyInputs,
//   handleReplyChange,
//   handleReplySubmit,
//   userImageUrl,
// }) => (
//   <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//     <div className="flex items-center gap-3 mb-2">
//       <img
//         src={
//           post.imageUrl
//             ? post.imageUrl
//             : `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                 post.name
//               )}&background=random`
//         }
//         className="w-9 h-9 rounded-full object-cover"
//         alt="Post Author"
//       />
//       <div>
//         <p className="font-semibold text-gray-800">{post.name}</p>
//         <p className="text-xs text-gray-500">
//           {moment(post.createdAt).fromNow()}
//         </p>
//       </div>
//       {isUserPostTab && post.userId === userId && (
//         <div className="ml-auto flex gap-2">
//           <button
//             className="text-blue-500 hover:text-blue-700"
//             title="Edit"
//             onClick={() => handleEditPost(post)}
//           >
//             <FaEdit />
//           </button>
//           <button
//             className="text-red-500 hover:text-red-700"
//             title="Delete"
//             onClick={() => handleDeletePost(post._id)}
//           >
//             <FaTrash />
//           </button>
//         </div>
//       )}
//     </div>
//     {editingPostId === post._id ? (
//       <div className="flex flex-col gap-2">
//         <textarea
//           value={editPostText}
//           onChange={(e) => setEditPostText(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2 resize-none text-sm"
//           rows="3"
//         />
//         <div className="flex gap-2">
//           <button
//             className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition flex items-center gap-1"
//             onClick={() => handleEditPostSave(post._id)}
//           >
//             <FaCheck /> Save
//           </button>
//           <button
//             className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition flex items-center gap-1"
//             onClick={handleEditPostCancel}
//           >
//             <FaTimes /> Cancel
//           </button>
//         </div>
//       </div>
//     ) : (
//       <p className="mt-2 text-gray-700 text-sm">{post.text}</p>
//     )}
//     <div className="flex flex-wrap gap-2 mt-2">
//       {post.tags?.map((tag, i) => (
//         <span
//           key={i}
//           className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
//         >
//           #{tag}
//         </span>
//       ))}
//     </div>
//     <div className="flex gap-5 text-sm text-gray-600 mt-3">
//       <button
//         onClick={() => handleLike(post._id)}
//         className={`flex items-center gap-1 transition ${
//           likedPosts[post._id] ? "text-red-500" : "hover:text-red-500"
//         }`}
//       >
//         <FaHeart /> {Array.isArray(post.likes) ? post.likes.length : post.likes}
//       </button>
//       <span className="flex items-center gap-1">
//         <FaComment /> {post.commentsCount}
//       </span>
//       <button
//         onClick={() => handleSave(post._id, !!savedMap[post._id], isUserPostTab)}
//         className={`flex items-center gap-1 transition ${
//           savedMap[post._id] ? "text-yellow-500" : "hover:text-yellow-500"
//         }`}
//         title={savedMap[post._id] ? "Unsave" : "Save"}
//       >
//         {savedMap[post._id] ? <FaBookmark /> : <FaRegBookmark />}{" "}
//         {savedMap[post._id] ? "Saved" : "Save"}
//       </button>
//     </div>
//     <div className="mt-3">
//       <input
//         type="text"
//         placeholder="Add a comment..."
//         value={commentInputs[post._id] || ""}
//         onChange={(e) => handleCommentChange(post._id, e.target.value)}
//         className="w-full border border-gray-300 rounded p-1 text-sm"
//       />
//       <button
//         onClick={() => handleCommentSubmit(post._id)}
//         className="mt-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
//       >
//         Comment
//       </button>
//     </div>
//     <div className="mt-3 space-y-2">
//       {post.comments &&
//         post.comments.slice().reverse().map((cmt, i) => (
//           <div
//             key={cmt._id || i}
//             className="flex flex-col gap-1 pl-2 border-l-2 border-gray-200"
//           >
//             <div className="flex items-start gap-2">
//               <img
//                 src={
//                   cmt.imageUrl
//                     ? cmt.imageUrl
//                     : `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                         cmt.name
//                       )}&background=random`
//                 }
//                 alt="Commenter"
//                 className="w-6 h-6 rounded-full mt-1"
//               />
//               <div>
//                 <p className="text-sm">
//                   <span className="font-semibold">{cmt.name}</span>:{" "}
//                   {cmt.text}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {moment(cmt.time).fromNow()}
//                 </p>
//                 <button
//                   className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
//                   onClick={() =>
//                     setReplyInputs({
//                       ...replyInputs,
//                       [cmt._id]: replyInputs[cmt._id] === undefined ? "" : undefined,
//                     })
//                   }
//                 >
//                   <FaReply className="text-xs" /> Reply
//                 </button>
//               </div>
//             </div>
//             {replyInputs[cmt._id] !== undefined && (
//               <div className="ml-8 mt-2">
//                 <input
//                   type="text"
//                   placeholder="Add a reply..."
//                   value={replyInputs[cmt._id] || ""}
//                   onChange={(e) =>
//                     handleReplyChange(cmt._id, e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded p-1 text-sm"
//                 />
//                 <button
//                   onClick={() => handleReplySubmit(post._id, cmt._id)}
//                   className="mt-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
//                 >
//                   Reply
//                 </button>
//               </div>
//             )}
//             {cmt.replies && cmt.replies.length > 0 && (
//               <div className="ml-8 mt-2 space-y-1">
//                 {cmt.replies
//                   .slice()
//                   .reverse()
//                   .map((reply, j) => (
//                     <div key={j} className="flex items-start gap-2">
//                       <img
//                         src={
//                           reply.imageUrl
//                             ? reply.imageUrl
//                             : `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                                 reply.name
//                               )}&background=random`
//                         }
//                         alt="Replier"
//                         className="w-5 h-5 rounded-full mt-1"
//                       />
//                       <div>
//                         <p className="text-xs">
//                           <span className="font-semibold">
//                             {reply.name}
//                           </span>
//                           : {reply.text}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {moment(reply.time).fromNow()}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         ))}
//     </div>
//   </div>
// );

// const Item7 = () => {
//   const { user, isLoaded, isSignedIn } = useUser();
//   const userName = user?.fullName || "Anonymous User";
//   const userId = user?.id;

//   const [tabValue, setTabValue] = useState(0);
//   const [userPosts, setUserPosts] = useState([]);
//   const [savedPosts, setSavedPosts] = useState([]);
//   const [likedPosts, setLikedPosts] = useState({});
//   const [savedMap, setSavedMap] = useState({});
//   const [editingPostId, setEditingPostId] = useState(null);
//   const [editPostText, setEditPostText] = useState("");
//   const [commentInputs, setCommentInputs] = useState({});
//   const [replyInputs, setReplyInputs] = useState({});
//   const [loadingUserPosts, setLoadingUserPosts] = useState(false);
//   const [loadingSavedPosts, setLoadingSavedPosts] = useState(false);

//   const fetchUserPosts = useCallback(async () => {
//     if (!userId) return;
//     setLoadingUserPosts(true);
//     try {
//       const response = await axios.get(`${API_URL}?userId=${userId}`);
//       const postsData = (response.data || []).filter(post => post.userId === userId);
//       setUserPosts(postsData);

//       const initialLikedPosts = {};
//       const initialSavedMap = {};
//       postsData.forEach((post) => {
//         if (Array.isArray(post.likes) && post.likes.includes(userId)) {
//           initialLikedPosts[post._id] = true;
//         }
//         if (Array.isArray(post.savedBy) && post.savedBy.includes(userId)) {
//           initialSavedMap[post._id] = true;
//         }
//       });
//       setLikedPosts(initialLikedPosts);
//       setSavedMap(initialSavedMap);
//     } catch (error) {
//       console.error("Error fetching user posts:", error);
//       setUserPosts([]);
//     } finally {
//       setLoadingUserPosts(false);
//     }
//   }, [userId]);

//   const fetchSavedPosts = useCallback(async () => {
//     if (!userId) return;
//     setLoadingSavedPosts(true);
//     try {
//       const response = await axios.get(`${API_URL}/saved/${userId}`);
//       setSavedPosts(response.data || []);
//       const initialSavedMap = {};
//       (response.data || []).forEach(post => {
//         initialSavedMap[post._id] = true;
//       });
//       setSavedMap(initialSavedMap);
//     } catch (error) {
//       console.error("Error fetching saved posts:", error);
//       setSavedPosts([]);
//     } finally {
//       setLoadingSavedPosts(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//       if (tabValue === 0) {
//         fetchUserPosts();
//       } else if (tabValue === 1) {
//         fetchSavedPosts();
//       }
//     }
//   }, [isLoaded, isSignedIn, tabValue, fetchUserPosts, fetchSavedPosts]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleEditPost = (post) => {
//     setEditingPostId(post._id);
//     setEditPostText(post.text);
//   };

//   const handleEditPostSave = async (postId) => {
//     if (!editPostText.trim()) return;
//     try {
//       const res = await axios.patch(`${API_URL}/${postId}`, {
//         text: editPostText,
//         userId: userId,
//       });
//       setUserPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setEditingPostId(null);
//       setEditPostText("");
//     } catch (err) {
//       console.error("Error editing post:", err);
//       alert("Failed to edit post. Please try again.");
//     }
//   };

//   const handleEditPostCancel = () => {
//     setEditingPostId(null);
//     setEditPostText("");
//   };

//   const handleDeletePost = async (postId) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`${API_URL}/${postId}`, { data: { userId: userId } });
//       setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.error) {
//         alert(err.response.data.error);
//       } else {
//         alert("Failed to delete post. Please try again.");
//       }
//       console.error("Error deleting post:", err);
//     }
//   };

//   const handleLike = async (postId) => {
//     if (!userId) {
//       alert("Please log in to like posts.");
//       return;
//     }
//     try {
//       const res = await axios.patch(`${API_URL}/${postId}/like`, { userId });
//       setUserPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setSavedPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
//     } catch (err) {
//       console.error("Error liking post:", err);
//       alert("Failed to like/unlike post. Please try again.");
//     }
//   };

//   const handleSave = async (postId, isSaved, isUserPostTab) => {
//     if (!userId) {
//       alert("Please log in to save posts.");
//       return;
//     }
//     try {
//       const res = await axios.patch(`${API_URL}/${postId}/save`, { userId });
//       setSavedMap((prev) => ({ ...prev, [postId]: !isSaved }));
//       if (isUserPostTab) {
//         setUserPosts((prevPosts) =>
//           prevPosts.map((post) => (post._id === postId ? res.data : post))
//         );
//       } else {
//         if (isSaved) {
//           setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
//         } else {
//           setSavedPosts((prev) =>
//             prev.map((post) => (post._id === postId ? res.data : post))
//           );
//         }
//       }
//     } catch (err) {
//       console.error("Error saving/unsaving post:", err);
//       alert("Failed to save/unsave post. Please try again.");
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setCommentInputs((prev) => ({ ...prev, [postId]: value }));
//   };

//   const handleCommentSubmit = async (postId) => {
//     const commentText = commentInputs[postId];
//     if (!commentText || !commentText.trim()) return;
//     if (!userId) {
//       alert("Please log in to comment.");
//       return;
//     }
//     try {
//       const res = await axios.post(`${API_URL}/${postId}/comment`, {
//         userId,
//         name: userName,
//         imageUrl: user.imageUrl,
//         text: commentText,
//       });
//       setUserPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setSavedPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
//     } catch (err) {
//       console.error("Error submitting comment:", err);
//       alert("Failed to add comment. Please try again.");
//     }
//   };

//   const handleReplyChange = (commentId, value) => {
//     setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
//   };

//   const handleReplySubmit = async (postId, commentId) => {
//     const replyText = replyInputs[commentId];
//     if (!replyText || !replyText.trim()) return;
//     if (!userId) {
//       alert("Please log in to reply.");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `${API_URL}/${postId}/comments/${commentId}/reply`,
//         {
//           userId,
//           name: userName,
//           imageUrl: user.imageUrl,
//           text: replyText,
//         }
//       );
//       setUserPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setSavedPosts((prevPosts) =>
//         prevPosts.map((post) => (post._id === postId ? res.data : post))
//       );
//       setReplyInputs((prev) => ({ ...prev, [commentId]: undefined }));
//     } catch (err) {
//       console.error("Error submitting reply:", err);
//       alert("Failed to add reply. Please try again.");
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <div className="flex justify-center mt-10">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!isSignedIn) {
//     return (
//       <div className="max-w-2xl mx-auto mt-8 text-center text-gray-500">
//         Please sign in to view your profile and posts.
//       </div>
//     );
//   }

//   const filteredUserPosts = userPosts.filter(post => post.userId === userId);

//   return (
//     <div className="max-w-2xl mx-auto mt-8 w-full">
//       {/* Profile Header */}
//       <div className="flex items-center mb-6">
//         <img
//           src={user.imageUrl}
//           alt={user.fullName}
//           className="w-24 h-24 rounded-full mr-6 object-cover"
//         />
//         <div>
//           <div className="text-2xl font-bold">{userName}</div>
//           <div className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</div>
//           <div className="flex gap-6 mt-2">
//             <span>
//               <strong>{filteredUserPosts.length}</strong> posts
//             </span>
//             <span>
//               <strong>{savedPosts.length}</strong> Saved post
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b mb-6">
//         <button
//           className={`px-4 py-2 font-semibold ${
//             tabValue === 0
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={() => setTabValue(0)}
//         >
//           Posts
//         </button>
//         <button
//           className={`px-4 py-2 font-semibold ${
//             tabValue === 1
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500"
//           }`}
//           onClick={() => setTabValue(1)}
//         >
//           Saved
//         </button>
//       </div>

//       {/* Tab Content */}
//       {tabValue === 0 && (
//         <div>
//           {loadingUserPosts ? (
//             <div className="flex justify-center items-center py-10">
//               <svg className="animate-spin text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="60" height="60">
//                 <circle className="opacity-25" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M8 24a16 16 0 0132 0h-8z"></path>
//               </svg>
//               <span className="ml-4 text-green-700 text-lg font-semibold">Loading posts...</span>
//             </div>
//           ) : filteredUserPosts.length > 0 ? (
//             filteredUserPosts.map((post) => (
//               <PostCard
//                 key={post._id}
//                 post={post}
//                 isUserPostTab={true}
//                 userId={userId}
//                 userName={userName}
//                 editingPostId={editingPostId}
//                 editPostText={editPostText}
//                 setEditPostText={setEditPostText}
//                 handleEditPost={handleEditPost}
//                 handleEditPostSave={handleEditPostSave}
//                 handleEditPostCancel={handleEditPostCancel}
//                 handleDeletePost={handleDeletePost}
//                 likedPosts={likedPosts}
//                 handleLike={handleLike}
//                 savedMap={savedMap}
//                 handleSave={handleSave}
//                 commentInputs={commentInputs}
//                 handleCommentChange={handleCommentChange}
//                 handleCommentSubmit={handleCommentSubmit}
//                 replyInputs={replyInputs}
//                 setReplyInputs={setReplyInputs}
//                 handleReplyChange={handleReplyChange}
//                 handleReplySubmit={handleReplySubmit}
//                 userImageUrl={user.imageUrl}
//               />
//             ))
//           ) : (
//             <div className="text-center text-gray-400 py-8">
//               You haven't made any posts yet.
//             </div>
//           )}
//         </div>
//       )}

//       {tabValue === 1 && (
//         <div>
//           {loadingSavedPosts ? (
//             <div className="flex justify-center items-center py-10">
//               <svg className="animate-spin text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="60" height="60">
//                 <circle className="opacity-25" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M8 24a16 16 0 0132 0h-8z"></path>
//               </svg>
//               <span className="ml-4 text-green-700 text-lg font-semibold">Loading saved posts...</span>
//             </div>
//           ) : savedPosts.length > 0 ? (
//             savedPosts.map((post) => (
//               <PostCard
//                 key={post._id}
//                 post={post}
//                 isUserPostTab={false}
//                 userId={userId}
//                 userName={userName}
//                 editingPostId={editingPostId}
//                 editPostText={editPostText}
//                 setEditPostText={setEditPostText}
//                 handleEditPost={handleEditPost}
//                 handleEditPostSave={handleEditPostSave}
//                 handleEditPostCancel={handleEditPostCancel}
//                 handleDeletePost={handleDeletePost}
//                 likedPosts={likedPosts}
//                 handleLike={handleLike}
//                 savedMap={savedMap}
//                 handleSave={handleSave}
//                 commentInputs={commentInputs}
//                 handleCommentChange={handleCommentChange}
//                 handleCommentSubmit={handleCommentSubmit}
//                 replyInputs={replyInputs}
//                 setReplyInputs={setReplyInputs}
//                 handleReplyChange={handleReplyChange}
//                 handleReplySubmit={handleReplySubmit}
//                 userImageUrl={user.imageUrl}
//               />
//             ))
//           ) : (
//             <div className="text-center text-gray-400 py-8">
//               No saved posts.
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Item7;


import React from 'react'

const Item7 = () => {
  return (
    <div>Item7</div>
  )
}

export default Item7