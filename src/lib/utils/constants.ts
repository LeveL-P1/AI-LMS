// Navigation links
export const NAV_LINKS = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ] as const;
  
  // User roles
  export const USER_ROLES = {
    STUDENT: "student",
    INSTRUCTOR: "instructor", 
    ADMIN: "admin",
  } as const;
  
  // Feature highlights for landing page
  export const FEATURES = [
    {
      title: "AI-Powered Recommendations",
      description: "Get personalized course suggestions based on your interests and learning style",
      icon: "🤖",
    },
    {
      title: "Interactive Quizzes",
      description: "Test your knowledge with auto-generated quizzes from any lesson content",
      icon: "🧠",
    },
    {
      title: "Real-Time Progress",
      description: "Track your learning journey with detailed analytics and completion rates",
      icon: "📊",
    },
    {
      title: "Multi-Role Dashboard",
      description: "Students learn, instructors teach, admins manage - all in one platform",
      icon: "👥",
    },
  ] as const;
  
  // Pricing plans
  export const PRICING_PLANS = [
    {
      name: "Student",
      price: 0,
      period: "forever",
      description: "Perfect for individual learners",
      features: [
        "Access to free courses",
        "Basic progress tracking",
        "Community forum access",
        "Mobile app support",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro Student",
      price: 19,
      period: "month",
      description: "Advanced features for serious learners",
      features: [
        "All Student features",
        "AI-powered recommendations",
        "Unlimited course access",
        "Priority support",
        "Offline content download",
      ],
      buttonText: "Start Free Trial",
      popular: true,
    },
    {
      name: "Instructor",
      price: 49,
      period: "month",
      description: "For educators and content creators",
      features: [
        "Create unlimited courses",
        "Student analytics dashboard",
        "Auto-generate quizzes",
        "Revenue sharing",
        "Advanced reporting tools",
      ],
      buttonText: "Start Teaching",
      popular: false,
    },
  ] as const;

