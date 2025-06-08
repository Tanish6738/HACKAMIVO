// import React, { useState } from 'react';
// import { IoMdStopwatch } from "react-icons/io";
// import { ArrowLeft } from "lucide-react";
// import DotPlay from "../games/Dot_play";
// import Monkey from "../games/Monkey";
// import Memory_match from "../images/memory_match.png";
// import Emotion_Recognination from "../images/Emotion.png";
// import Pattern_recall from "../images/pattern.png";
// import Word_association from "../images/word_association.png";
// import FocusTrainer_game from '../images/Mindfull_logo.png';

// const gamesData = [
//   {
//     title: 'Memory Match',
//     category: 'Memory',
//     difficulty: 'Easy',
//     duration: '3 min',
//     tag: 'Daily Challenge',
//     tagColor: 'green',
//     description: 'Train your memory with card matching',
//     active: true,
//     image: Memory_match,
//   },
//   {
//     title: 'Focus Trainer',
//     category: 'Focus',
//     difficulty: 'Medium',
//     duration: '5 min',
//     tag: 'Popular',
//     tagColor: 'blue',
//     description: 'Improve concentration with timed exercises',
//     active: true,
//     image: FocusTrainer_game,
//   },
//   {
//     title: 'Emotion Recognition',
//     category: 'Emotion',
//     difficulty: 'Medium',
//     duration: '4 min',
//     tag: 'New',
//     tagColor: 'green',
//     description: 'Practice identifying emotional expressions',
//     active: true,
//     image: Emotion_Recognination,
//   },
//   {
//     title: 'Breathing Zen',
//     category: 'Relaxation',
//     difficulty: 'Easy',
//     duration: '7 min',
//     description: 'Follow the pattern for deep relaxation',
//     active: true,
//     image: FocusTrainer_game, // Placeholder, replace with actual image if available
//   },
//   {
//     title: 'Word Association',
//     category: 'Memory',
//     difficulty: 'Hard',
//     duration: '6 min',
//     description: 'Connect related words to boost creativity',
//     tag: 'Coming Soon',
//     tagColor: 'purple',
//     active: false,
//     image: Word_association,
//   },
//   {
//     title: 'Pattern Recall',
//     category: 'Memory',
//     difficulty: 'Medium',
//     duration: '4 min',
//     description: 'Remember and recreate visual patterns',
//     tag: 'Coming Soon',
//     tagColor: 'purple',
//     active: false,
//     image: Pattern_recall,
//   },
//   // {
//   //   title: 'Dot Play',
//   //   category: 'Focus',
//   //   difficulty: 'Easy',
//   //   duration: '1 min',
//   //   tag: 'New',
//   //   tagColor: 'yellow',
//   //   description: 'Click the moving dot as many times as you can in 20 seconds!',
//   //   active: true,
//   //   image: FocusTrainer_game,
//   // },
// ];

// const ComingSoon = ({ title, onBack }) => (
//   <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 sm:p-8 md:p-10 min-h-[300px] flex flex-col items-center justify-center ">
//     {/* Sticky Back Button */}
//     <div className="sticky top-4 self-end z-50">
//       <button
//         onClick={onBack}
//         className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-full p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
//         style={{ minWidth: 0 }}
//       >
//         <ArrowLeft className="w-5 h-5" />
//       </button>
//     </div>

//     {/* Content */}
//     <div className="mt-8 text-center ">
//       <div className="text-5xl sm:text-6xl mb-4">🚧</div>
//       <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
//         {title}
//       </h2>
//       <p className="text-gray-600 dark:text-gray-300 mb-6">
//         This game is coming soon. Stay tuned!
//       </p>

//       {/* Back Button (Bottom) */}
//       <button
//         onClick={onBack}
//         className=" bg-gradient-to-r  text-black bg-green-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         Back to Game List
//       </button>
//     </div>
//   </div>
// );

// const Item2 = ({ onGameSelect = (title) => console.log('Selected game:', title) }) => {
//   const [filter, setFilter] = useState('All');
//   const [comingSoonGame, setComingSoonGame] = useState(null);
//   const [activeGame, setActiveGame] = useState(null);

//   const handleGameSelect = (title) => {
//     if (title === "Dot Play") {
//       setActiveGame("Dot Play");
//     } else {
//       onGameSelect(title);
//     }
//   };

//   const filteredGames = filter === 'All'
//     ? gamesData
//     : gamesData.filter(game => game.category === filter);

//   if (activeGame === "Dot Play") {
//     return (
//       <div className="max-w-2xl mx-auto p-4">
//         <DotPlay onBack={() => setActiveGame(null)} />
//       </div>
//     );
//   }

//   if (comingSoonGame) {
//     return (
//       <div className="max-w-2xl mx-auto p-4">
//         <ComingSoon title={comingSoonGame} onBack={() => setComingSoonGame(null)} />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 space-y-8">
//       <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
//           <img src={Memory_match} alt="Memory Match" className="h-40 object-contain" />
//         </div>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2 text-sm">
//             <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Game of the Day</span>
//             <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Easy</span>
//           </div>
//           <h2 className="text-2xl font-semibold">Memory Match</h2>
//           <p className="text-sm">Train your memory with card matching</p>
//           <p className="text-sm text-gray-500 flex items-center"><IoMdStopwatch /> 3 min</p>
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             onClick={() => handleGameSelect('Memory Match')}
//           >
//             Play Now
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-2 justify-between items-center">
//         <h1 className="font-bold text-xl md:text-2xl">Game Collection</h1>
//         <div className="flex flex-wrap gap-2 justify-between items-center">
//           {['All', 'Focus', 'Memory', 'Emotion', 'Relaxation'].concat(
//             gamesData.some(g => g.category === 'Strategy') ? ['Strategy'] : []
//           ).map(category => (
//             <button
//               key={category}
//               className={`px-4 py-2 rounded-full hover:bg-gray-300 ${
//                 filter === category ? 'bg-gray-400 text-white' : 'bg-gray-200'
//               }`}
//               onClick={() => setFilter(category)}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredGames.map((game, index) => (
//           <div key={index} className="bg-white rounded-xl shadow-md p-4 space-y-2 relative">
//             {game.tag && (
//               <span
//                 className={`absolute top-2 right-2 bg-${game.tagColor}-100 text-${game.tagColor}-700 text-xs px-2 py-1 rounded-full`}
//               >
//                 {game.tag}
//               </span>
//             )}
//             <div className="bg-gray-200 h-36 rounded-lg flex items-center justify-center">
//               {game.image ? (
//                 <img src={game.image} alt={game.title} className="h-full object-contain" />
//               ) : (
//                 <span className="text-gray-500">Image</span>
//               )}
//             </div>
//             <div className="text-sm text-gray-500 flex justify-start gap-1.5 items-center">
//               <IoMdStopwatch /> {game.duration}
//             </div>
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold">{game.title}</h3>
//               <span
//                 className={`text-xs px-2 py-1 rounded-full ${
//                   game.difficulty === 'Easy'
//                     ? 'bg-green-100 text-green-700'
//                     : game.difficulty === 'Medium'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'bg-purple-100 text-purple-700'
//                 }`}
//               >
//                 {game.difficulty}
//               </span>
//             </div>
//             <p className="text-sm">{game.description}</p>
//             {game.active ? (
//               <button
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
//                 onClick={() => {
//                   if (game.title === "Dot Play") {
//                     setActiveGame("Dot Play");
//                   } else {
//                     handleGameSelect(game.title);
//                   }
//                 }}
//               >
//                 Play Now
//               </button>
//             ) : (
//               <button
//                 className="bg-gray-300 text-gray-600 px-4 py-2 rounded w-full"
//                 onClick={() => setComingSoonGame(game.title)}
//               >
//                 Coming Soon
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Item2;



import React from 'react'

const Item2 = () => {
  return (
    <div>Lead Finder</div>
  )
}

export default Item2