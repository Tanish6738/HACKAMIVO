import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "What is this AI-powered lead generator?",
    answer:
      "It’s a smart platform that helps you discover, enrich, and connect with qualified leads using AI. It scrapes web data, enriches profiles, and auto-generates outreach messages.",
  },
  {
    question: "Who is this tool for?",
    answer:
      "Sales teams, business development reps, marketers, recruiters, and admissions officers — anyone who spends time finding and messaging potential leads.",
  },
  {
    question: "What platforms does it pull lead data from?",
    answer:
      "Our AI scrapes publicly available data from websites, LinkedIn, and trusted databases to compile complete lead profiles.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your leads, messages, and interactions are securely stored, encrypted, and accessible only to your team.",
  },
  {
    question: "What features are coming soon?",
    answer:
      "We're rolling out CRM integrations (like HubSpot and Salesforce), predictive lead scoring, team collaboration tools, and advanced analytics dashboards.",
  },
];

const Faq = () => {
  return (
    <div className="w-70% px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            className="rounded-2xl shadow-md"
            sx={{
              backgroundColor: "transparent",
              borderColor: "rgb(0, 177, 216)",
              borderWidth: "1px",
              color: "rgb(0, 177, 216)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "rgb(0, 177, 216)" }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography className="text-lg font-medium">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-gray-700" sx={{ color: "rgb(0, 177, 216)" }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Faq;