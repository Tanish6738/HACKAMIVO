// import { useState } from "react";
// import Accordion from '@mui/material/Accordion';
// import AccordionActions from '@mui/material/AccordionActions';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { BookOpen, Bot, LifeBuoy, Wrench } from 'lucide-react'; // Importing icons from lucide-react
// import { MdOutlineMail } from "react-icons/md";
// import { IoChatbox } from "react-icons/io5";


// export default function HelpSupport({ChatwithAi,viewallresource}) {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   const faqs = [
//     { question: "Is this app private?", answer: "" },
//     { question: "How do I join the community?", answer: "" },
//     { question: "Where can I find emergency resources?", answer: "" },
//     {
//       question: "Can I download my data?",
//       answer:
//         "Yes, you can download all your data from the Settings page. This includes your mood tracking history, completed activities, and personal notes. We provide the data in a common format that's easy to read and store.",
//     },
//     { question: "How do I cancel my subscription?", answer: "" },
//   ];

//   return (
//     <div className="w-full mx-auto p-6 space-y-6 bg-[#F0F0F0]">
//       {/* Top Cards */}
//  <section class="px-4 py-6 sm:px-6 lg:px-8">
//   <div class="max-w-7xl mx-auto flex items-start flex-col gap-3">
//     <div class="mb-6 text-center ">
//       <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ">How Can We Support You?</h1>
//       <p class="text-base text-gray-600 max-w-2xl mx-auto">Whether you're facing a crisis or just need help, we're here.</p>
//     </div>

//     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <div class="bg-white rounded-xl shadow-lg border border-red-300 transform transition duration-300 hover:scale-105 flex flex-col h-full">
//         <div class="w-full bg-red-50 p-4 rounded-t-xl">
//           <h3 class="text-lg font-semibold text-gray-900">Emergency Help</h3>
//           <p class="text-gray-600 text-sm">Immediate resources for crisis situations</p>
//         </div>
//         <div class="p-4 text-sm space-y-2">
//           <div class="flex items-center text-gray-700">
//             <i class="ph-fill ph-phone text-red-500 text-base mr-2"></i>
//             <span>Crisis Hotline</span>
//           </div>
//           <p class="text-gray-900 font-medium">1-800-273-8255</p>
//           <div class="flex items-center text-gray-700">
//             <i class="ph-fill ph-chat-text text-red-500 text-base mr-2"></i>
//             <span>Text Crisis Line</span>
//           </div>
//           <p class="text-gray-900 font-medium">Text HOME to 741741</p>
//         </div>
//         <div class="p-4 pt-0 mt-auto "onClick={viewallresource}>
//           <a href="#" class="inline-block w-full text-center bg-transparent border border-red-500 text-red-500 py-2 px-4 rounded-md text-sm font-medium hover:bg-red-50 hover:text-red-600 transition duration-300">
//             View All Resources
//           </a>
//         </div>
//       </div>

//       <div class="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col h-full">
//         <div class="flex items-center mb-2">
//           <i class="ph-fill ph-calendar-blank text-green-600 text-2xl mr-2"></i>
//           <h3 class="text-lg font-semibold text-gray-900">Talk to a Professional</h3>
//         </div>
//         <p class="text-gray-600 text-sm mb-1">Schedule a session with a licensed therapist</p>
//         <p class="text-gray-700 text-sm mb-2">Connect with licensed therapists specializing in various mental health areas.</p>
//         <div class="mt-auto">
//           <a href="#" class="inline-block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition duration-300">
//             Book a Session
//           </a>
//         </div>
//       </div>

//       <div class="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col h-full">
//         <div class="flex items-center mb-2">
//           <i class="ph-fill ph-robot text-blue-500 text-2xl mr-2"></i>
//           <h3 class="text-lg font-semibold text-gray-900">Chat with AI Assistant</h3>
//         </div>
//         <p class="text-gray-600 text-sm mb-1">Get immediate guidance and support</p>
//         <p class="text-gray-700 text-sm mb-2">Our AI can provide coping strategies, exercises, and basic mental health support.</p>
//         <div class="mt-auto" onClick={ChatwithAi}>
//           <a href="#" class="inline-block w-full text-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition duration-300">
//             Start Chat
//           </a>
//         </div>
//       </div>

//       <div class="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col h-full">
//         <div class="flex items-center mb-2">
//           <i class="ph-fill ph-wrench text-purple-600 text-2xl mr-2"></i>
//           <h3 class="text-lg font-semibold text-gray-900">Technical Support</h3>
//         </div>
//         <p class="text-gray-600 text-sm mb-1">Help with app issues and questions</p>
//         <p class="text-gray-700 text-sm mb-2">Having trouble with the app? Our technical team is ready to help.</p>
//         <div class="mt-auto">
//        <a href="https://wa.me/917440780233" class="inline-block w-full text-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition duration-300" target="_blank" rel="noopener noreferrer">
//   Get Help
// </a>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>


//       {/* FAQ Section */}
//       <div className="pt-6">
//       <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
//       {faqs.map((faq, index) => (
//         <Accordion
//           key={index}
//           expanded={openIndex === index}
//           onChange={() => toggleAccordion(index)}
//           // Set background color and remove border
//           sx={{
//             backgroundColor: '#F0F0F0', // Corresponds to Tailwind's gray-100
//             border: 'none',             // Removes the border
//             boxShadow: 'none',          // Optionally remove default shadow if it looks like a border
//           }}
//         >
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls={`faq-content-${index}`}
//             id={`faq-header-${index}`}
//           >
//             <span className="font-medium text-gray-800">{faq.question}</span>
//           </AccordionSummary>
//           <AccordionDetails>
//             <p className="text-sm text-gray-600">
//               {faq.answer || "We're working on this answer. Please check back soon."}
//             </p>
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </div>

//       {/* Contact Support */}
//       <div className=" p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
//         <h4 className="text-lg md:text-3xl  font-semibold mb-2 ">Still Need Help?</h4>
//         <p className="text-sm text-gray-700 mb-4">
//           Our support team is ready to assist you with any questions or concerns.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <div className="flex items-center gap-2">
//             <span className="text-green-600 text-2xl"><MdOutlineMail/></span>
//             <div>
//               <p className="text-sm font-medium">Email Support</p>
//               <p className="text-sm text-gray-600">support@mindfullme.com</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-green-600 text-2xl"><IoChatbox/></span>
//             <div>
//               <p className="text-sm font-medium">Live Chat</p>
//               <p className="text-sm text-gray-600">Available 9am–5pm EST</p>
//             </div>
//           </div>
//         </div>
//        <a 
//   href="https://wa.me/917440780233" 
//   class="inline-block bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md font-medium text-center no-underline" 
//   target="_blank" 
//   rel="noopener noreferrer"
// >
//   Send us a message
// </a>
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