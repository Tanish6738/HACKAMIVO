// Type definitions for chat-service.js
export function generateResponse(userMessage: string): string
export function getGreeting(): string
export function handleSpecialCommands(message: string): string | null
export function getSuggestedQuestions(): string[]

