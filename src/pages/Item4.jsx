// import React, { useState } from 'react';
// import "../index.css";
// import {
//   FaChevronRight
// } from 'react-icons/fa';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import { useUser } from "@clerk/clerk-react";
// import MusicPlayer from "./INNER_content_Music";

// // --- Pre-recorded, ASMR, and Music data (no images) ---
// const preRecordedVideos = [
//   {
//     title: "Release Stress & Improve Focus",
//     duration: "10 MIN",
//     views: "611K views",
//     ago: "11 months ago",
//     channel: "Hum Jeetenge Meditation",
//     videoSrc: "https://www.youtube.com/embed/Lv1jpqkN4ZY?si=J23e1gx27c3yWO82",
//   },
//   {
//     title: "7 Min Guided Meditation for Focus and Mental Clarity",
//     duration: "7 MIN",
//     views: "138K views",
//     ago: "2 years ago",
//     channel: "Hum Jeetenge Meditation",
//     videoSrc: "https://www.youtube.com/embed/9O8xkWySvX4?si=I7_VoGIXAhP_og-i",
//   },
//   {
//     title: "Calm Your Mind with Guided Meditation",
//     duration: "15 MIN",
//     views: "320K views",
//     ago: "8 months ago",
//     channel: "Hum Jeetenge Meditation",
//     videoSrc: "https://www.youtube.com/embed/qqks74DW0DE?si=tbWFC1QQXiW2OUGd",
//   },
//   {
//     title: "Daily Relaxation Techniques",
//     duration: "20 MIN",
//     views: "280K views",
//     ago: "1 year ago",
//     channel: "Hum Jeetenge Meditation",
//     videoSrc: "https://www.youtube.com/embed/wPoZVN6WsQg?si=cKXMjafOoXD8Ufta",
//   },
//   {
//     title: "Morning Energy Boost Meditation",
//     duration: "10 MIN",
//     views: "110K views",
//     ago: "6 months ago",
//     channel: "Hum Jeetenge Meditation",
//     videoSrc: "https://www.youtube.com/embed/D08e9UZFKdE?si=MmR_2RGZqlJJDP_l",
//   },
 
//   {
//     title: "Evening Relaxation and Gratitude",
//     duration: "8 MIN",
//     views: "89K views",
//     ago: "3 months ago",
//     channel: "Hum Jeetenge Meditation",
//     videoSrc: "https://www.youtube.com/embed/Ax05WkNwOiU?si=u7rSuSkQxeH_3WbA",
//   },
// ];

// const asmrVideos = [
//   {
//     title: "Deep Relaxation Music 1",
//     description: "A calming track designed to help you unwind and release stress.",
//     iframeSrc: "https://www.youtube.com/embed/yditiWAHTCM?si=13d-u0xJh97zLSdy",
//   },
//   {
//     title: "Tranquil Mind Meditation",
//     description: "Soft, serene music to clear your mind and bring you peace.",
//     iframeSrc: "https://www.youtube.com/embed/ysLkaafDyGw?si=ISprh3KxTuVgj9pP",
//   },
//   {
//     title: "Healing Soundscapes",
//     description: "Relaxing soundscapes that rejuvenate your mind and soul.",
//     iframeSrc: "https://www.youtube.com/embed/1NeAIuVl5JY?si=aD0AQ06KE-5RIfCh",
//   },
//   {
//     title: "Calming Waves Meditation",
//     description: "A beautiful blend of ocean waves and calming music for deep relaxation.",
//     iframeSrc: "https://www.youtube.com/embed/VEWmRyZJcQI?si=Prs26fvKEBYVQXTA",
//   },
//   {
//     title: "Serenity Sounds",
//     description: "Peaceful music designed to help you find serenity and inner calm.",
//     iframeSrc: "https://www.youtube.com/embed/rD9jpzZc4ZQ?si=rz1oudIlcEKg_owq",
//   },
// ];

// // --- PreRecordedTab Component ---
// function PreRecordedTab() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-full">
//       {preRecordedVideos.map((video, idx) => (
//         <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center h-full">
//           <iframe
//             width="100%"
//             height="180"
//             src={video.videoSrc}
//             title={video.title}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerPolicy="strict-origin-when-cross-origin"
//             allowFullScreen
//           ></iframe>
//           <h3 className="font-semibold text-gray-800 text-base mb-1">{video.title}</h3>
//           <p className="text-gray-600 text-xs mb-1">{video.duration} • {video.channel}</p>
//           <p className="text-gray-400 text-xs mb-2">{video.views} • {video.ago}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // --- ASMRTab Component ---
// function ASMRTab() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-full">
//       {asmrVideos.map((item, idx) => (
//         <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center h-full">
//           <iframe
//             width="100%"
//             height="180"
//             src={item.iframeSrc}
//             title={item.title}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerPolicy="strict-origin-when-cross-origin"
//             allowFullScreen
//           ></iframe>
//           <h3 className="font-semibold text-gray-800 text-base mb-1">{item.title}</h3>
//           <p className="text-gray-600 text-xs mb-2">{item.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // --- MusicTab Component ---
// function MusicTab() {
//   // Use w-full h-full for equal tab container height
//   return (
//     <div className="w-full h-full">
//       <MusicPlayer />
//     </div>
//   );
// }

// export default function Dashboard() {
//   const [resourceTab, setResourceTab] = useState(0);

//   return (
//     <div className="p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen font-sans bg-[#F0F0F0] w-full max-w-full">
//       {/* Calming Resources as Tabs */}
//       <div className="p-2 sm:p-4 md:p-8 mt-4 sm:mt-6 bg-white rounded-lg shadow-md">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 space-y-2 sm:space-y-0">
//           <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Calming Resources</h2>
//           <button className="text-green-600 flex items-center space-x-1 hover:underline text-sm">
//           </button>
//         </div>
//         <Box sx={{ width: '100%', bgcolor: 'transparent', mb: 2 }}>
//           <Tabs
//             value={resourceTab}
//             onChange={(_, newValue) => setResourceTab(newValue)}
//             indicatorColor="primary"
//             textColor="primary"
//             variant="fullWidth"
//             aria-label="Calming Resources Tabs"
//             sx={{ mb: 2, minHeight: 64 }}
//           >
//             <Tab label="Pre-recorded Sessions" sx={{ minHeight: 64, fontSize: '1rem' }} />
//             <Tab label="ASMR Video" sx={{ minHeight: 64, fontSize: '1rem' }} />
//             <Tab label="Music" sx={{ minHeight: 64, fontSize: '1rem' }} />
//           </Tabs>
//           {/* Set a fixed minHeight for the tab content to make all tabs equal height */}
//           <div
//             className="mt-4 w-full h-full"
//             style={{
//               minHeight: "500px", // Adjust as needed for your design
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "flex-start"
//             }}
//           >
//             {resourceTab === 0 && <PreRecordedTab />}
//             {resourceTab === 1 && <ASMRTab />}
//             {resourceTab === 2 && <MusicTab />}
//           </div>
//         </Box>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const Item3 = () => {
  return (
    <div>Enrichment</div>
  )
}

export default Item3