

"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Minimize2, ChevronUp } from "lucide-react"
import { generateResponse, getGreeting, handleSpecialCommands, getSuggestedQuestions } from "../services/chat-service"

// Chat message component
const ChatMessage = ({ message, isBot }) => {
  // Function to render message with line breaks
  const renderMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))
  }

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
  )
}

// Suggested questions component
const SuggestedQuestions = ({ onSelectQuestion }) => {
  const questions = getSuggestedQuestions()
  const [visibleQuestions, setVisibleQuestions] = useState(3)

  // Determine how many questions to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleQuestions(3)
      } else {
        setVisibleQuestions(questions.length)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [questions.length])

  return (
    <div className="mb-3">
      <p className="text-xs sm:text-sm text-gray-500 mb-1.5">Suggested questions:</p>
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
  )
}

// Main enhanced chatbot component
export default function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([{ message: getGreeting(), isBot: true }])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatHistory])

  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e?.preventDefault()
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = message
    setChatHistory((prev) => [...prev, { message: userMessage, isBot: false }])
    setMessage("")
    setIsTyping(true)

    // Check for special commands first
    const specialResponse = handleSpecialCommands(userMessage)

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = specialResponse || generateResponse(userMessage)
      setChatHistory((prev) => [...prev, { message: botResponse, isBot: true }])
      setIsTyping(false)
    }, 1000)
  }

  // Handle suggested question selection
  const handleSelectQuestion = (question) => {
    setMessage(question)
    handleSendMessage()
  }

  // Calculate chat window dimensions based on device
  const getChatWindowClasses = () => {
    if (isMinimized) {
      return "bottom-4 right-4 w-auto h-auto"
    }

    if (isMobile) {
      return "bottom-0 right-0 left-0 w-full h-[70vh] rounded-b-none"
    }

    return "bottom-4 right-4 w-80 sm:w-96"
  }

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
                  <span className="text-sm sm:text-base">Dhruv AI Assistant</span>
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
<div className="p-3 sm:p-4 flex-grow overflow-y-auto bg-gray-50" style={{ maxHeight: '400px' }}>
  {chatHistory.map((chat, index) => (
    <ChatMessage key={index} message={chat.message} isBot={chat.isBot} />
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
                    setMessage(q)
                    setTimeout(() => handleSendMessage(), 100)
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
  )
}
