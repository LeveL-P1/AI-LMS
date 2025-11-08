"use client";

import { Card, CardContent } from "@/components/common/ui/card";
import { Badge } from "@/components/common/ui/badge";
import { 
  Brain, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  Sparkles,
  BookOpen,
  PieChart,
  MessageSquare
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description: "Our smart algorithm analyzes your learning style, progress, and interests to suggest the perfect courses tailored just for you.",
    badge: "AI Feature",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
  },
  {
    icon: Zap,
    title: "Auto-Generate Quizzes",
    description: "Upload any lesson content and watch AI instantly create comprehensive quizzes to test understanding and retention.",
    badge: "Smart Content",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track your progress with detailed insights, completion rates, and personalized performance summaries powered by AI.",
    badge: "Analytics",
    color: "text-green-600 bg-green-100 dark:bg-green-900/20",
  },
  {
    icon: Users,
    title: "Multi-Role Dashboard",
    description: "Students learn, instructors create and manage courses, admins oversee everything - all with role-specific interfaces.",
    badge: "Platform",
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
  },
  {
    icon: Target,
    title: "Personalized Learning Paths",
    description: "AI creates custom learning journeys based on your goals, skill level, and preferred pace for maximum effectiveness.",
    badge: "Personalization",
    color: "text-red-600 bg-red-100 dark:bg-red-900/20",
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    description: "Built with enterprise-grade security and modern architecture that scales with your learning community.",
    badge: "Security",
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20",
  },
];

const stats = [
  {
    icon: BookOpen,
    value: "500+",
    label: "Courses Available",
    description: "From beginner to expert level"
  },
  {
    icon: PieChart,
    value: "95%",
    label: "Completion Rate", 
    description: "Higher than industry average"
  },
  {
    icon: MessageSquare,
    value: "24/7",
    label: "AI Support",
    description: "Always available to help"
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center space-y-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by Advanced AI</span>
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Everything you need to
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              accelerate learning
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Our platform combines cutting-edge AI technology with proven educational methods 
            to create the most effective learning experience possible.
          </motion.p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="text-center border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <motion.div 
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl font-bold mb-1"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="font-medium mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 h-full">
                  <CardContent className="p-6 h-full">
                    <div className="space-y-4 h-full flex flex-col">
                      {/* Icon and Badge */}
                      <div className="flex items-center justify-between">
                        <motion.div 
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.color}`}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <feature.icon className="h-6 w-6" />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        </motion.div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2 flex-grow">
                        <motion.h3 
                          className="text-xl font-semibold group-hover:text-primary transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          {feature.title}
                        </motion.h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-4 rounded-2xl border bg-background/60 backdrop-blur-sm p-6 hover:bg-background/80 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="text-left">
              <div className="font-semibold">Ready to experience AI-powered learning?</div>
              <div className="text-sm text-muted-foreground">Join thousands of learners already achieving their goals</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
