// import React, { useState } from 'react';
// import { LuBot } from "react-icons/lu";
// import Skeleton from '@mui/material/Skeleton';
// import CircularProgress from '@mui/material/CircularProgress';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import His from './His';

// const suggestedTopics = [
//   `"I'm feeling anxious about work today"`,
//   `"How can I improve my sleep quality?"`,
//   `"I need help managing stress"`,
//   `"What are some quick mindfulness exercises?"`,
//   `"I'm feeling overwhelmed with my tasks"`,
// ];

// // Format feedback content: bold, italic, paragraphs, lists, remove leading dots/bullets
// function formatFeedbackContent(content) {
//   if (!content) return "";

//   // Replace **bold**
//   let formatted = content.replace(
//     /\*\*(.*?)\*\*/g,
//     '<strong class="font-semibold text-green-800">$1</strong>'
//   );

//   // Replace *italic*
//   formatted = formatted.replace(
//     /\*(.*?)\*/g,
//     '<em>$1</em>'
//   );

//   // Remove leading dots, asterisks, bullets, and numbers from each line
//   formatted = formatted
//     .split('\n')
//     .map(line =>
//       line
//         .replace(/^(\d+\.)\s*/, "") // Remove "1. ", "2. ", etc.
//         .replace(/^•\s*/, "")       // Remove "• "
//         .replace(/^\*\s*/, "")      // Remove "* "
//         .replace(/^\.\s*/, "")      // Remove ". "
//         .trim()
//     )
//     .join('\n');

//   // Process paragraphs and lists
//   let result = "";
//   const paragraphs = formatted.split("\n\n");

//   for (let i = 0; i < paragraphs.length; i++) {
//     const para = paragraphs[i];

//     // Bullet/list detection
//     if (
//       para.trim().startsWith("- ") ||
//       para.trim().startsWith("* ") ||
//       para.trim().match(/^(\d+\.)\s/)
//     ) {
//       // List
//       const items = para
//         .split('\n')
//         .map(item =>
//           item
//             .replace(/^-\s*/, "")
//             .replace(/^\*\s*/, "")
//             .replace(/^(\d+\.)\s*/, "")
//             .replace(/^•\s*/, "")
//             .replace(/^\.\s*/, "")
//             .trim()
//         )
//         .filter(Boolean);
//       result += `<ul class="list-disc pl-5 space-y-2">${items
//         .map(
//           (item) =>
//             `<li class="mb-1">${item}</li>`
//         )
//         .join("")}</ul>`;
//     } else if (para.trim()) {
//       // Paragraph
//       result += `<p class="mb-2">${para.trim()}</p>`;
//     }
//   }

//   return result;
// }

// export default function AIWellnessGuide() {
//   const [loading, setLoading] = useState(false);
//   const [aiFeedback, setAiFeedback] = useState(
//     'Try **5 minutes of mindful breathing** before bed tonight.\n\n- This can help calm your mind and improve sleep quality.\n- Make sure your room is dark and quiet.\n- Avoid screens 30 minutes before sleep.'
//   );
//   const [userMessage, setUserMessage] = useState('');
//   const [accordionOpen, setAccordionOpen] = useState(true);

//   const handleGetRecommendation = async () => {
//     if (!userMessage.trim()) {
//       setAiFeedback('Please enter your message.');
//       return;
//     }
//     setLoading(true);
//     setAiFeedback('');
//     try {
//       const response = await fetch('https://krish09bha-mindful-me.hf.space/feedback/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userMessage }),
//       });
//       if (!response.ok) throw new Error('Failed to fetch recommendation');
//       const data = await response.json();
//       setAiFeedback(data.feedback || 'No recommendation found.');
//       setAccordionOpen(true);
//     } catch (err) {
//       setAiFeedback('Sorry, something went wrong. Please try again.');
//     }
//     setLoading(false);
//   };

//   const InputField = (
//     <div className="relative mb-4 min-w-0">
//       <input
//         type="text"
//         className="block w-full border border-gray-300 rounded-lg p-4 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm bg-white placeholder-gray-400"
//         placeholder="Describe how you're feeling..."
//         value={userMessage}
//         onChange={e => setUserMessage(e.target.value)}
//         disabled={loading}
//         autoComplete="off"
//         style={{ minWidth: 0 }}
//       />
//       {userMessage && !loading && (
//         <button
//           type="button"
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
//           onClick={() => setUserMessage('')}
//           tabIndex={-1}
//           aria-label="Clear input"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       )}
//     </div>
//   );

//   const renderFormattedFeedback = () => {
//     return (
//       <div
//         className="space-y-3"
//         dangerouslySetInnerHTML={{ __html: formatFeedbackContent(aiFeedback) }}
//       />
//     );
//   };

//   return (
//     <div className="bg-[#F0F0F0] min-h-screen px-2 py-6 sm:py-10">
//       <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8">
//         <div className="flex-1 min-w-0">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-gray-900 tracking-wide leading-tight">
//             Your AI Wellness Guide
//           </h1>
//           <p className="text-gray-600 mb-10 text-base sm:text-lg max-w-xl">
//             Curated tips just for you to feel your best, every day.
//           </p>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-12">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#edf6fc] p-5 rounded-t-xl border-b border-blue-200">
//               <div className="flex items-start justify-center font-semibold text-lg sm:text-xl flex-col">
//                 <div className='flex'>
//                   <LuBot className='text-2xl mr-4' />
//                   <span> AI Mental Health Assistant</span>
//                 </div>
//                 <span className='text-[1rem]'>Share how you're feeling to get personalized guidance</span>
//               </div>
//             </div>
//             <div className="p-6">
//               {/* Input always stays above the AI Recommendation */}
//               {InputField}
//               <Accordion
//                 expanded={accordionOpen}
//                 onChange={() => setAccordionOpen(!accordionOpen)}
//                 sx={{
//                   boxShadow: 'none',
//                   border: 'none',
//                   background: 'transparent',
//                   mb: 2,
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   aria-controls="ai-feedback-content"
//                   id="ai-feedback-header"
//                   sx={{ minHeight: 0, px: 0, py: 0 }}
//                 >
//                   <span className="font-semibold text-base sm:text-lg text-green-700">
//                     AI Recommendation
//                   </span>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ px: 0, py: 1 }}>
//                   <div className="w-full flex justify-center">
//                     <div className="w-full sm:max-w-3xl bg-green-50 border border-green-200 rounded-lg px-5 py-4 flex items-start gap-3 shadow-sm">
//                       <span className="mt-1 text-green-500 text-xl"><LuBot /></span>
//                       <div className="flex-1 text-gray-800 text-base sm:text-lg whitespace-pre-line leading-relaxed">
//                         {loading ? (
//                           <Skeleton
//                             variant="text"
//                             width="100%"
//                             sx={{ fontSize: '1.25rem', height: '2.5rem', lineHeight: '2.5rem' }}
//                             animation="wave"
//                           />
//                         ) : (
//                           renderFormattedFeedback()
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionDetails>
//               </Accordion>
//               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 border-t border-gray-200 pt-5 mt-6">
//                 <button
//                   className="flex items-center px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-md text-sm sm:text-base whitespace-nowrap"
//                   type="button"
//                   onClick={handleGetRecommendation}
//                   disabled={loading}
//                 >
//                   {loading && <CircularProgress size={18} color="inherit" className="mr-2" />}
//                   Get AI Recommendation
//                 </button>
//               </div>
//             </div>
//           </div>

//           <His />
//         </div>

//         <div className="w-full lg:w-[340px] flex-shrink-0">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">How It Works</h3>
//             <ol className="mb-6 space-y-3 text-gray-700 text-base">
//               <li className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
//                 <span><span className="font-semibold">Share Your Thoughts</span><br /><span className="text-gray-500">Describe how you're feeling or ask for specific guidance</span></span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</span>
//                 <span><span className="font-semibold">AI Analysis</span><br /><span className="text-gray-500">Our AI processes your message and your wellness history</span></span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</span>
//                 <span><span className="font-semibold">Personalized Guidance</span><br /><span className="text-gray-500">Receive tailored recommendations and insights</span></span>
//               </li>
//             </ol>
//             <div>
//               <h4 className="text-base font-semibold text-gray-800 mb-2">Suggested Topics</h4>
//               <ul className="space-y-2">
//                 {suggestedTopics.map((topic, idx) => (
//                   <li
//                     key={idx}
//                     className="bg-blue-50 border border-blue-100 rounded px-3 py-2 text-gray-700 text-sm hover:bg-blue-100 cursor-pointer transition"
//                     onClick={() => setUserMessage(topic.replace(/"/g, ""))}
//                   >
//                     {topic}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const Item5 = () => {
  return (
    <div>outRach</div>
  )
}

export default Item5