export interface HelpArticle {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: HelpArticle[];
}

export const helpContent: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Everything you need to know to get up and running",
    icon: "rocket",
    articles: [
      {
        id: "what-is-viral-together",
        question: "What is Viral Together?",
        answer: "Viral Together is a platform that connects influencers and businesses for collaboration opportunities. We help brands find the perfect influencers for their campaigns and enable creators to monetize their influence through authentic partnerships.",
        tags: ["basics", "overview", "platform"]
      },
      {
        id: "how-to-create-account",
        question: "How do I create an account?",
        answer: "Creating an account is simple! Click the 'Get Started' button on our homepage, choose whether you're an influencer or business, fill out the registration form with your details, and verify your email address. You'll be ready to start using the platform immediately.",
        tags: ["account", "registration", "signup"]
      },
      {
        id: "choosing-account-type",
        question: "Should I choose Influencer or Business account?",
        answer: "Choose 'Influencer' if you're a content creator looking to collaborate with brands. Choose 'Business' if you're a company looking to partner with influencers for marketing campaigns. You can contact support if you need to change your account type later.",
        tags: ["account", "influencer", "business", "type"]
      },
      {
        id: "setting-up-profile",
        question: "How do I set up my profile?",
        answer: "After registration, complete your profile by adding a professional photo, writing a compelling bio, listing your social media accounts, and specifying your interests or industry focus. A complete profile gets more visibility and collaboration opportunities.",
        tags: ["profile", "setup", "optimization"]
      },
      {
        id: "first-steps",
        question: "What should I do after creating my account?",
        answer: "Complete your profile, explore the platform features, set up your preferences, and start browsing opportunities. Influencers should create rate cards, while businesses should explore our influencer directory to find potential partners.",
        tags: ["onboarding", "next-steps", "guide"]
      },
      {
        id: "platform-navigation",
        question: "How do I navigate the platform?",
        answer: "Use the main navigation menu to access different sections: Dashboard for overview, Browse to find partners, Collaborations to manage active projects, and Profile to update your information. The search function helps you quickly find specific features or content.",
        tags: ["navigation", "interface", "dashboard"]
      }
    ]
  },
  {
    id: "for-influencers",
    title: "For Influencers",
    description: "Maximize your earning potential and grow your influence",
    icon: "users",
    articles: [
      {
        id: "creating-influencer-profile",
        question: "How do I create an effective influencer profile?",
        answer: "Include a high-quality profile photo, write a compelling bio highlighting your niche and audience, add links to all your social media accounts, showcase your best content, and include relevant metrics like follower counts and engagement rates.",
        tags: ["profile", "optimization", "influencer"]
      },
      {
        id: "setting-up-rate-cards",
        question: "How do I set up my rate cards?",
        answer: "Navigate to your dashboard and click 'Rate Cards'. Create different packages for various content types (posts, stories, videos), set competitive pricing based on your audience size and engagement, and include clear deliverables for each package.",
        tags: ["rate-cards", "pricing", "packages"]
      },
      {
        id: "collaboration-process",
        question: "How does the collaboration process work?",
        answer: "Businesses will send you collaboration requests based on your profile and rate cards. Review the proposal, negotiate terms if needed, accept the collaboration, create and deliver the agreed content, and receive payment upon completion.",
        tags: ["collaboration", "workflow", "process"]
      },
      {
        id: "getting-paid",
        question: "How and when do I get paid?",
        answer: "Payments are processed after you complete the deliverables and the business approves your work. Payment methods include bank transfer and PayPal. Processing typically takes 3-5 business days depending on your chosen method.",
        tags: ["payment", "earnings", "payout"]
      },
      {
        id: "building-portfolio",
        question: "How can I build my portfolio on the platform?",
        answer: "Upload examples of your best work, showcase successful collaborations, highlight positive feedback from brands, and regularly update your content to reflect your current style and capabilities.",
        tags: ["portfolio", "showcase", "examples"]
      },
      {
        id: "increasing-visibility",
        question: "How can I increase my visibility to brands?",
        answer: "Complete your profile 100%, use relevant keywords in your bio, stay active on the platform, respond quickly to messages, maintain high-quality content standards, and ask satisfied clients for reviews.",
        tags: ["visibility", "discovery", "optimization"]
      },
      {
        id: "collaboration-best-practices",
        question: "What are the best practices for collaborations?",
        answer: "Communicate clearly with brands, deliver content on time, follow brand guidelines closely, disclose partnerships properly, maintain your authentic voice, and always deliver what you promised in your proposal.",
        tags: ["best-practices", "collaboration", "tips"]
      },
      {
        id: "managing-multiple-collaborations",
        question: "How do I manage multiple collaborations?",
        answer: "Use your dashboard to track all active projects, set realistic timelines, prioritize based on deadlines and importance, communicate proactively with brands about your schedule, and consider using a content calendar.",
        tags: ["management", "organization", "multiple-projects"]
      }
    ]
  },
  {
    id: "for-businesses",
    title: "For Businesses",
    description: "Find the perfect influencers and run successful campaigns",
    icon: "briefcase",
    articles: [
      {
        id: "finding-right-influencers",
        question: "How do I find the right influencers for my brand?",
        answer: "Use our search filters to find influencers by niche, audience size, location, and engagement rates. Review their profiles, past work, and audience demographics to ensure alignment with your brand values and target market.",
        tags: ["discovery", "search", "matching"]
      },
      {
        id: "creating-promotions",
        question: "How do I create effective promotions?",
        answer: "Clearly define your campaign goals, target audience, budget, and timeline. Write compelling campaign briefs that explain your brand story, provide clear guidelines, and specify deliverables. Include visual assets and brand guidelines.",
        tags: ["promotions", "campaigns", "creation"]
      },
      {
        id: "managing-collaborations",
        question: "How do I manage collaborations effectively?",
        answer: "Set clear expectations upfront, maintain regular communication with influencers, provide timely feedback on content, track deliverables and deadlines, and build long-term relationships with top-performing creators.",
        tags: ["management", "collaboration", "workflow"]
      },
      {
        id: "understanding-pricing",
        question: "How does influencer pricing work?",
        answer: "Pricing varies based on follower count, engagement rate, content type, and niche. Micro-influencers (1K-100K) typically charge $10-500 per post, while macro-influencers (100K+) can charge $500-10K+. Review rate cards for specific pricing.",
        tags: ["pricing", "rates", "budget"]
      },
      {
        id: "measuring-success",
        question: "How do I measure campaign success?",
        answer: "Track metrics like reach, engagement, click-through rates, conversions, and brand awareness. Set clear KPIs before launching campaigns and use tracking links or promo codes to measure direct impact on sales or sign-ups.",
        tags: ["analytics", "metrics", "roi"]
      },
      {
        id: "collaboration-contracts",
        question: "Do I need contracts for collaborations?",
        answer: "Yes, always use contracts that outline deliverables, timelines, payment terms, usage rights, and disclosure requirements. Our platform provides basic agreement templates, but consult legal counsel for complex campaigns.",
        tags: ["contracts", "legal", "agreements"]
      },
      {
        id: "content-approval-process",
        question: "How does the content approval process work?",
        answer: "Influencers will submit content for your review before posting. Provide clear, constructive feedback within the agreed timeframe. Focus on brand alignment and guidelines rather than creative style to maintain authenticity.",
        tags: ["approval", "content", "review"]
      },
      {
        id: "building-influencer-relationships",
        question: "How can I build long-term relationships with influencers?",
        answer: "Treat influencers as partners, not just service providers. Pay promptly, provide clear feedback, respect their creative process, offer fair compensation, and consider exclusive partnerships with top performers.",
        tags: ["relationships", "partnerships", "retention"]
      }
    ]
  },
  {
    id: "account-billing",
    title: "Account & Billing",
    description: "Manage your account settings and subscription",
    icon: "credit-card",
    articles: [
      {
        id: "account-settings",
        question: "How do I update my account settings?",
        answer: "Go to your Profile section and click 'Settings'. You can update your personal information, contact details, notification preferences, privacy settings, and connected social media accounts.",
        tags: ["settings", "account", "profile"]
      },
      {
        id: "subscription-plans",
        question: "What subscription plans are available?",
        answer: "We offer Free, Pro, and Enterprise plans. Free includes basic features, Pro adds advanced analytics and priority support, Enterprise includes custom features and dedicated account management. Check our Pricing page for details.",
        tags: ["subscription", "plans", "pricing"]
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our encrypted payment system.",
        tags: ["payment", "methods", "billing"]
      },
      {
        id: "billing-questions",
        question: "I have a question about my bill",
        answer: "You can view your billing history and download invoices from your Account Settings. For billing disputes or questions, contact our support team with your account details and we'll resolve the issue quickly.",
        tags: ["billing", "invoice", "support"]
      },
      {
        id: "canceling-subscription",
        question: "How do I cancel my subscription?",
        answer: "You can cancel anytime from your Account Settings. Click 'Subscription' and then 'Cancel Plan'. Your access will continue until the end of your current billing period, and you won't be charged again.",
        tags: ["cancellation", "subscription", "termination"]
      },
      {
        id: "data-export",
        question: "Can I export my data?",
        answer: "Yes, you can export your profile data, collaboration history, and analytics from your Account Settings. We provide data in CSV and JSON formats. Contact support for bulk exports or custom data requests.",
        tags: ["data", "export", "download"]
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Solutions to common technical issues",
    icon: "help-circle",
    articles: [
      {
        id: "login-issues",
        question: "I can't log into my account",
        answer: "First, check that you're using the correct email and password. Try resetting your password if needed. Clear your browser cache and cookies, or try a different browser. If you're still having issues, contact our support team.",
        tags: ["login", "password", "access"]
      },
      {
        id: "profile-not-showing",
        question: "My profile isn't showing up in searches",
        answer: "Ensure your profile is 100% complete with all required fields filled out. Check that your account is verified and your profile is set to 'public'. It may take up to 24 hours for new profiles to appear in search results.",
        tags: ["visibility", "search", "profile"]
      },
      {
        id: "payment-problems",
        question: "I'm having payment issues",
        answer: "Verify that your payment method is valid and has sufficient funds. Check that your billing address matches your payment method. If you're still experiencing issues, try a different payment method or contact your bank.",
        tags: ["payment", "billing", "issues"]
      },
      {
        id: "technical-difficulties",
        question: "The platform is running slowly or not working",
        answer: "Try refreshing the page or clearing your browser cache. Check your internet connection and try accessing the platform from a different device. If the issue persists, it may be a temporary server issue - try again in a few minutes.",
        tags: ["performance", "technical", "bugs"]
      },
      {
        id: "browser-compatibility",
        question: "Which browsers are supported?",
        answer: "Viral Together works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience. Internet Explorer is not supported.",
        tags: ["browser", "compatibility", "requirements"]
      },
      {
        id: "mobile-app",
        question: "Is there a mobile app?",
        answer: "Yes! We have mobile apps for both iOS and Android. You can download them from the App Store or Google Play Store. The mobile app includes all core features with a mobile-optimized interface.",
        tags: ["mobile", "app", "download"]
      },
      {
        id: "notification-issues",
        question: "I'm not receiving notifications",
        answer: "Check your notification settings in your account preferences. Ensure your email address is verified and check your spam folder. For push notifications, make sure they're enabled in your browser or mobile app settings.",
        tags: ["notifications", "email", "settings"]
      },
      {
        id: "account-security",
        question: "How do I secure my account?",
        answer: "Use a strong, unique password and enable two-factor authentication in your security settings. Never share your login credentials and log out from shared devices. Report any suspicious activity to our support team immediately.",
        tags: ["security", "password", "2fa"]
      }
    ]
  }
];
