import React from 'react';
import {
  Upload,
  Search,
  Mail,
  MessageSquare,
  Database,
  Globe,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Lead Discovery',
    description:
      'Automatically scrape LinkedIn, websites, and public databases to identify decision-makers and verified professionals using AI.',
    icon: <Search className="w-8 h-8 text-blue-600" />,
    color: 'bg-blue-50 border-blue-400',
  },
  {
    number: 2,
    title: 'Data Enrichment',
    description:
      'Enhance each lead with accurate emails, company info, job titles, and more. Includes email verification through licensed services.',
    icon: <Database className="w-8 h-8 text-green-600" />,
    color: 'bg-green-50 border-green-400',
  },
  {
    number: 3,
    title: 'Real Time Screaning',
    description:
      'View approach leads generated from AI or Export  CSV File ',
    icon: <Mail className="w-8 h-8 text-orange-500" />,
    color: 'bg-orange-50 border-orange-400',
  },
  
];

const benefits = [
  {
    title: 'Compliant & Secure',
    description:
      'Lead Spark is fully compliant with GDPR, CCPA, and only uses publicly accessible data. You’re always in control.',
    icon: <Shield className="h-8 w-8 text-white" />,
  },
  {
    title: 'AI-Powered Outreach',
    description:
      'Write engaging cold messages in seconds using Bot AI. Automate multi-step outreach campaigns effortlessly.',
    icon: <MessageSquare className="h-8 w-8 text-white" />,
  },
  {
    title: 'Built-in Analytics',
    description:
      'Monitor open rates, click-throughs, and replies. Visual performance tracking right inside your dashboard.',
    icon: <BarChart3 className="h-8 w-8 text-white" />,
  },
  {
    title: 'Ask Bot Anything',
    description:
      'Use fast, AI-generated answers when suggested questions aren’t enough. Always helpful, always on.',
    icon: <Globe className="h-8 w-8 text-white" />,
  },
];

// Step Component
const StepItem = ({ step, idx }) => (
  <li
    className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group"
    data-aos-delay={idx * 150}
  >
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 min-w-[3.5rem] sm:min-w-[4rem] flex items-center justify-center rounded-full border-4 ${step.color} shadow-md group-hover:scale-105 transition-transform mb-2 sm:mb-0`}
    >
      {step.icon}
    </div>
    <div>
      <span className="text-sm font-semibold text-blue-700">Step {step.number}</span>
      <h4 className="text-lg sm:text-xl font-semibold text-blue-900 mt-1 mb-1">
        {step.title}
      </h4>
      <p className="text-base text-gray-600 leading-relaxed">{step.description}</p>
    </div>
  </li>
);

// Benefit Card Component
const BenefitCard = ({ item, idx }) => (
  <div
    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg hover:scale-105 transition-transform"
    data-aos-delay={idx * 150}
  >
    <div className="mb-4 flex justify-center">{item.icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
    <p className="text-blue-100 text-sm sm:text-base">{item.description}</p>
  </div>
);

const HowItWorksPage = () => {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="AI platform connecting leads"
          className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0"
        />
        <div className="absolute inset-0 bg-blue-900/70 z-0" />
        <div className="relative z-10 text-center px-4 py-10 md:py-0 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            How Lead Spark Works
          </h1>
          <p
            className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto"
            data-aos-delay="200"
          >
            Discover, enrich, and connect with qualified leads at scale—powered by AI and data you
            can trust.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-10 sm:py-20 px-2 sm:px-4 bg-white border-b border-blue-100 w-full">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-blue-900">
            Step-by-Step Process
          </h2>
          <ol className="space-y-8 sm:space-y-12">
            {steps.map((step, idx) => (
              <StepItem step={step} idx={idx} key={idx} />
            ))}
          </ol>
        </div>
      </section>

      {/* Benefits */}
      <section className="flex items-center justify-center py-10 sm:py-20 w-full mx-auto bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="container px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Why Choose Lead Spark
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {benefits.map((item, idx) => (
              <BenefitCard item={item} idx={idx} key={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full flex items-center justify-center py-10 sm:py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container px-2 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Start Generating Quality Leads Today
          </h2>
          <p
            className="mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg"
            data-aos-delay="200"
          >
            Lead Spark helps you find and connect with the right people—faster, smarter, and fully
            compliant. Start a free trial and supercharge your pipeline.
          </p>
          <button className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 hover:scale-105 transition-all px-8 py-4 rounded-xl text-lg font-semibold flex items-center mx-auto">
            <Search className="mr-2 h-6 w-6" /> Get Started Now
          </button>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;