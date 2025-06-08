// ✅ Knowledge base for AI-Powered Lead Generator
const knowledgeBase = {
  general: [
    {
      keywords: ["what", "platform", "for", "lead", "generator"],
      response:
        "This platform helps automate lead generation using AI. It scrapes websites, LinkedIn, and public databases to discover potential prospects, enriches them with relevant data, and automatically drafts outreach messages.",
    },
    {
      keywords: ["goal", "purpose", "why", "use"],
      response:
        "The primary goal of this platform is to streamline how businesses and institutions find and reach qualified leads—helping increase sales or admissions conversions while reducing manual work.",
    },
  ],

  technology: [
    {
      keywords: ["how", "system", "work"],
      response:
        "We use intelligent web scraping and APIs to collect lead data, enrich it with information like contact info and job titles, and then generate personalized outreach messages using GPT-based models.",
    },
    {
      keywords: ["scrape", "linkedin", "web", "data"],
      response:
        "Yes! The system is capable of scraping public LinkedIn profiles and other websites to extract lead data including names, professions, companies, and more, in compliance with public data terms.",
    },
    {
      keywords: ["enrich", "data", "email", "contact", "details"],
      response:
        "Our enrichment process adds valuable info to lead profiles, such as email addresses, phone numbers, location, company info, job titles, and social profiles—so your outreach is well-informed.",
    },
    {
      keywords: ["outreach", "message", "email", "generate"],
      response:
        "Yes! Our system can automatically draft outreach emails customized to each lead's profile, leveraging AI for tone, relevance, and personalization. You can preview or edit before sending.",
    },
  ],

  features: [
    {
      keywords: ["features", "capabilities"],
      response:
        "Top features include: 1) Web and LinkedIn scraping, 2) Lead data enrichment, 3) AI-powered outreach messaging, 4) CRM integrations, 5) Lead list management, 6) Analytics & tracking.",
    },
    {
      keywords: ["crm", "integration", "hubspot", "salesforce"],
      response:
        "We support integration with popular tools like HubSpot, Salesforce, and others. You can automatically sync enriched leads and messages to your CRM system.",
    },
  ],

  security: [
    {
      keywords: ["data", "secure", "privacy", "compliance"],
      response:
        "Yes, your data is secure. We follow industry best practices, encrypt all communications, and ensure that all scraping is legal and ethical using publicly available data.",
    },
    {
      keywords: ["encryption", "security", "protect"],
      response:
        "All data is encrypted in transit via HTTPS. We also apply sensitive data handling practices and prevent unauthorized access using strict access controls.",
    },
  ],

  usage: [
    {
      keywords: ["how", "upload", "start", "leads"],
      response:
        "You can start by entering a target industry or company list. Our platform will begin scraping and enriching the data before giving you a ready-to-use lead list.",
    },
    {
      keywords: ["campaign", "outreach", "launch"],
      response:
        "After enriching leads, you can launch an outreach campaign directly from the dashboard. Email drafts are generated using AI, which you can customize before sending.",
    },
  ],

  deployment: [
    {
      keywords: ["setup", "deploy", "install"],
      response:
        "The platform is cloud-based and requires no installation. Just sign in, input your target criteria, and let the system do the rest. For enterprise use, private hosting options are available.",
    },
  ],

  troubleshooting: [
    {
      keywords: ["not", "working", "error", "problem"],
      response:
        "Please ensure your filters are valid and your input data (like keywords or LinkedIn URLs) follows the expected format. If issues persist, contact our support team with error details.",
    },
    {
      keywords: ["leads", "missing", "data", "not", "showing"],
      response:
        "Some leads may not have available contact data due to privacy settings. We continually update our enrichment methods to maximize accuracy.",
    },
  ],

  future: [
    {
      keywords: ["roadmap", "future", "plans"],
      response:
        "Future plans include better intent prediction, voice-based outreach generation, multilingual lead scraping, and improved LinkedIn scraping efficiency with custom plugins.",
    },
    {
      keywords: ["contribute", "open", "source"],
      response:
        "We’re exploring open-source components and community plugins in the future. Join our newsletter or GitHub to stay updated if you’d like to contribute.",
    },
  ],
};

// ✅ Function to find the best matching response from the knowledge base
export function generateResponse(userMessage) {
  const message = userMessage.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  for (const category in knowledgeBase) {
    for (const item of knowledgeBase[category]) {
      const score = calculateMatchScore(message, item.keywords);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item.response;
      }
    }
  }

  if (highestScore < 0.3) {
    return "I'm not sure I understand. Could you please rephrase your question? You can ask about scraping, lead enrichment, outreach generation, CRM integrations, or security.";
  }

  return bestMatch + " Would you like help with something else?";
}

// ✅ Match score calculation based on keyword presence
function calculateMatchScore(message, keywords) {
  let matchCount = 0;

  for (const keyword of keywords) {
    if (message.includes(keyword.toLowerCase())) {
      matchCount++;
    }
  }

  return matchCount / keywords.length;
}

// ✅ Greeting based on time
export function getGreeting() {
  const hours = new Date().getHours();
  if (hours < 12) {
    return "Good morning! I'm your Lead Generation AI Assistant. How can I help you find, enrich, or outreach to qualified leads today?";
  } else if (hours < 18) {
    return "Good afternoon! Ready to generate some leads or automate outreach? I'm here to assist!";
  } else {
    return "Good evening! I'm your AI Assistant for smart lead generation. Ask me about scraping, enrichment, or outreach campaigns.";
  }
}

// ✅ Special chatbot commands
export function handleSpecialCommands(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage === "help") {
    return "You can ask me about features, AI scraping, CRM integrations, lead enrichment, and more. Try something like 'How do I scrape LinkedIn?' or 'What data do you enrich leads with?'";
  }

  if (lowerMessage === "features") {
    return (
      "Core features of the Lead Generator platform:\n" +
      "1. Scraping from websites, LinkedIn, and public databases\n" +
      "2. Automated lead enrichment (email, job title, etc.)\n" +
      "3. AI-generated outbound messages\n" +
      "4. CRM integrations with tools like HubSpot / Salesforce"
    );
  }

  return null;
}

// ✅ Suggested user questions
export function getSuggestedQuestions() {
  return [
    "How does LinkedIn scraping work?",
    "What information do you extract from a website?",
    "How do I enrich a lead with contact info?",
    "Can I generate outreach messages with AI?",
    "Do you integrate with CRMs like HubSpot?",
    "What if a lead is missing email or phone?",
  ];
}