import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useTheme, useMediaQuery } from '@mui/material';
import Memory_Game from '../games/Memory_Game'; 
import Focus_traninig from '../games/Focus_training';
import Emotion from '../games/Emotion';
import Breathing from "../games/Breathing"

// Import your Item components
import Item1 from './Item1';
import Item2 from './Item2';
import Item3 from './Item3';
import Item4 from './Item4';
import Item5 from './Item5';
import Item6 from "../layout/Item6";
import Item7 from '../layout/Item7';
import CSVAnalysis from '../component/CSVAnalysis';

// Enhanced Chatbot imports
import { Bot, Send, X, Minimize2, ChevronUp } from "lucide-react";
import {
  generateResponse,
  getGreeting,
  handleSpecialCommands,
  getSuggestedQuestions,
} from "../services/chat-service";

// Icons
import { FaHome } from 'react-icons/fa';
import { MdOutlineLocalLibrary, MdPeopleAlt } from 'react-icons/md';
import { LuBot, LuSmilePlus } from 'react-icons/lu';
import { CgGames, CgProfile } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { BarChart3 } from 'lucide-react';

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minHeight: 48,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  '& .MuiTab-iconWrapper': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5),
    fontSize: '1.2rem',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  '&.Mui-selected': {
    color: theme.palette.success.main,
    backgroundColor: theme.palette.success.light,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
    },
    action: {
      hover: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    fontSize: 16,
  },
});

// Chat message component
const ChatMessage = ({ message, isBot }) => {
  // Function to render message with line breaks
  const renderMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`${
          isBot
            ? "bg-blue-100 text-blue-800 rounded-tr-lg rounded-br-lg rounded-bl-lg"
            : "bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
        } px-3 py-2 sm:px-4 sm:py-2 max-w-[85%] sm:max-w-[80%] text-sm sm:text-base`}
      >
        {renderMessage(message)}
      </div>
    </div>
  );
};

// Suggested questions component
const SuggestedQuestions = ({ onSelectQuestion }) => {
  const questions = getSuggestedQuestions();
  const [visibleQuestions, setVisibleQuestions] = React.useState(3);

  // Determine how many questions to show based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleQuestions(3);
      } else {
        setVisibleQuestions(questions.length);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [questions.length]);

  return (
    <div className="mb-3">
      <p className="text-xs sm:text-sm text-gray-500 mb-1.5">
        Suggested questions:
      </p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {questions.slice(0, visibleQuestions).map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full transition-colors"
          >
            {question}
          </button>
        ))}
        {visibleQuestions < questions.length && (
          <button
            onClick={() => setVisibleQuestions(questions.length)}
            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1"
          >
            More...
          </button>
        )}
      </div>
    </div>
  );
};

// Main enhanced chatbot component
function EnhancedChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([
    { message: getGreeting(), isBot: true },
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  const chatEndRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to bottom of chat when new messages are added
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = message;
    setChatHistory((prev) => [...prev, { message: userMessage, isBot: false }]);
    setMessage("");
    setIsTyping(true);

    // Check for special commands first
    const specialResponse = handleSpecialCommands(userMessage);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = specialResponse || generateResponse(userMessage);
      setChatHistory((prev) => [
        ...prev,
        { message: botResponse, isBot: true },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle suggested question selection
  const handleSelectQuestion = (question) => {
    setMessage(question);
    handleSendMessage();
  };

  // Calculate chat window dimensions based on device
  const getChatWindowClasses = () => {
    if (isMinimized) {
      return "bottom-4 right-4 w-auto h-auto";
    }

    if (isMobile) {
      return "bottom-0 right-0 left-0 w-full h-[70vh] rounded-b-none";
    }

    return "bottom-4 right-4 w-80 sm:w-96";
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          aria-label="Open chat"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed ${getChatWindowClasses()} bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col`}
        >
          {/* Chat header */}
          <div className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-t-lg flex justify-between items-center">
            {isMinimized ? (
              <button
                onClick={() => setIsMinimized(false)}
                className="flex items-center space-x-2"
                aria-label="Expand chat"
              >
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Dhruv AI Assistant</span>
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">
                    Dhruv AI Assistant
                  </span>
                </div>
                <div className="flex space-x-2">
                  {!isMobile && (
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="text-white hover:text-gray-200"
                      aria-label="Minimize chat"
                    >
                      <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Chat body */}
          {!isMinimized && (
            <>
              <div
                className="p-3 sm:p-4 flex-grow overflow-y-auto bg-gray-50"
                style={{ maxHeight: "400px" }}
              >
                {chatHistory.map((chat, index) => (
                  <ChatMessage
                    key={index}
                    message={chat.message}
                    isBot={chat.isBot}
                  />
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-2 sm:px-4 sm:py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggested questions */}
              <div className="px-3 pt-2 sm:px-4 sm:pt-2 border-t border-gray-100">
                <SuggestedQuestions
                  onSelectQuestion={(q) => {
                    setMessage(q);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                />
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="border-t p-2 flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 text-sm sm:text-base border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-r-md hover:bg-blue-700"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ height: '100%', display: value === index ? 'block' : 'none', width: '100%' }}
    >
      {value === index && (
        <Box
          sx={{
            p: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              pr: 0,
              width: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {children}
          </Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [showTabsState, setShowTabsState] = React.useState(false);
const [selectedGame, setSelectedGame] = React.useState(null);


  
  const [showCheckinTabs, setShowCheckinTabs] = React.useState(false);

  const toggleTabs = () => {
    if (!isLargeScreen) {
      setShowTabsState((prev) => !prev);
    }
  };

  const showTabs = isLargeScreen || showTabsState;

  const [GoToLibrary, setGoToLibrary] = React.useState(false);  const tabsData = [
    { label: 'Dashboard', icon: <FaHome />, component: <Item1 showCheckinTabsFromSidebar={showCheckinTabs} setShowCheckinTabsFromSidebar={setShowCheckinTabs}   goToLibraryTab={() => setValue(2)} setgotolibrary={setGoToLibrary} playnow={()=>setValue(1)} joindiscussion={()=>setValue(4)} /> },
    { 
      label: 'Lead Finder', 
      icon: <CgGames />, 
      component: (
        selectedGame === null ? (
          <Item2 onGameSelect={setSelectedGame} />
        ) : selectedGame === 'Memory Match' ? (
          <Memory_Game />
        ) : selectedGame === 'Focus Trainer' ? (
          <Focus_traninig/>
        ) : selectedGame === 'Emotion Recognition' ? (
          <Emotion />
        ) : selectedGame === 'Breathing Zen' ? (
          <Breathing />
        ) : (
          <Item2 onGameSelect={setSelectedGame} />
        )
      )
    },
    { label: 'CSV Analysis', icon: <BarChart3 />, component: <CSVAnalysis /> },
    { label: 'Enrichment', icon: <MdOutlineLocalLibrary />, component: <Item4  /> },
    { label: 'Outreach Drafts', icon: <LuBot />, component: <Item5 /> },
    { label: 'Pipeline / CRM', icon: <MdPeopleAlt />, component: <Item6 /> },
    { label: 'csv2json', icon: <IoSettingsOutline />, component: <Item3  ChatwithAi={()=>setValue(3)} viewallresource={()=>setValue(2)}/> },
    { label: 'Settings', icon: <CgProfile />, component: <Item7 /> },
    // {
    //   label: 'Daily Check',
    //   icon: <LuSmilePlus />,
    //   isCheckin: true,
    //   component: null,
    // },
  ];

  const handleChange = (event, newValue) => {
    if (tabsData[newValue].isCheckin) {
      setShowCheckinTabs(true);
      setValue(0); 
      return;
    }
    setValue(newValue);
    setShowCheckinTabs(false);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
        {!isLargeScreen && (
          <IconButton
            onClick={toggleTabs}
            sx={{
              position: 'fixed',
              top: 12,
              left: 18,
              zIndex: 1201,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            {showTabsState ? <AiOutlineClose size={18} /> : <FiMenu size={18} />}
          </IconButton>
        )}

        {showTabs && (
          <Box
            sx={{
              display: { xs: 'block', md: 'block' },
              position: { xs: 'absolute', md: 'static' },
              minWidth: 180,
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: '2px 0px 5px -2px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              backgroundColor: { xs: 'background.paper', md: 'transparent' },
              zIndex: { xs: 1200, md: 'auto' },
              height: '100vh',
              
            }}
          >
            <Tabs
              orientation="vertical"
              value={value}
              onChange={handleChange}
              sx={{
                height: '100vh',
                '& .MuiTabs-indicator': {
                  backgroundColor: customTheme.palette.success.main,
                  left: 0,
                  width: '4px',
                },
              }}
            >
            {tabsData.map((tab, index) => (
  <StyledTab
    key={index}
    label={tab.label}
    icon={tab.icon}
    {...a11yProps(index)}
    sx={{
      mx: 1,
      my: 0.5,
      borderRadius: 2,
      transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: 'rgba(76, 175, 80, 0.08)', // subtle green hover
        color: 'primary.main',
        boxShadow: '0 2px 8px 0 rgba(76,175,80,0.08)',
      },
      '&.Mui-selected': {
        backgroundColor: 'success.light',
        color: 'success.main',
        fontWeight: 700,
        boxShadow: '0 4px 16px 0 rgba(76,175,80,0.10)',
      },
    }}
  />
))}
            </Tabs>
          </Box>
        )}

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: '#F0F0F0',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
         {tabsData.map((tab, index) => (
  <TabPanel key={index} value={value} index={index}>
    <div className="w-full h-full px-4 py-2">
      {tab.label === 'Games' && selectedGame !== null && (
        <div className="mb-4">
          <button
            className="fixed lg:left-50  left-2 text-sm font-medium px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            onClick={() => setSelectedGame(null)}
          >
            ← Back to Game List
          </button>
        </div>
      )}

      <div className="w-full">
        {tab.component}
      </div>
    </div>
  </TabPanel>
))}        </Box>
      </Box>
      
      {/* Enhanced Chatbot */}
      <EnhancedChatBot />
    </ThemeProvider>
  );
}