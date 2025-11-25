/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  ChartBar,
  Clock,
  Code,
  GraduationCap,
  Laptop,
  PlayCircle,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target,
  Lightbulb,
  Rocket,
  Shield,
  Globe,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Interactive Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillSyncAI
              </span>
            </motion.div>

            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-purple-50 p-6 no-underline outline-none focus:shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
                            <GraduationCap className="h-6 w-6 text-blue-600" />
                            <div className="mb-2 mt-4 text-lg font-medium text-gray-900">
                              SkillSyncAI Platform
                            </div>
                            <p className="text-sm leading-tight text-gray-600">
                              Advanced AI-powered learning management system
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-1">
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 border border-transparent hover:border-gray-200">
                            <div className="text-sm font-medium leading-none text-gray-900">
                              AI Learning
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                              Personalized AI-driven learning paths
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    href="/pricing"
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    href="/about"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    href="/contact"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Badge variant="outline" className="w-fit">
              <Zap className="mr-2 h-4 w-4" />
              AI-Powered Learning Platform
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Learn Smarter,
              </span>
              <br />
              <span className="text-gray-900">Not Harder</span>
            </h1>
            <p className="text-lg text-gray-600 lg:text-xl">
              Experience the future of education with AI-powered personalized
              learning paths, real-time analytics, and interactive content that
              adapts to your unique learning style.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group" asChild>
                <Link href="/sign-up">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>500+ Courses</span>
              </div>
            </div>
          </motion.div>

          <div
            className="relative hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Student Dashboard</h3>
                      <p className="text-white/80 text-xs">Welcome back, Alex!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Courses", value: "12", icon: BookOpen, color: "from-blue-500 to-blue-600" },
                  { label: "Progress", value: "78%", icon: ChartBar, color: "from-green-500 to-green-600" },
                  { label: "Streak", value: "15d", icon: Target, color: "from-purple-500 to-purple-600" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className={`h-6 w-6 mx-auto mb-2 rounded bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Current Course */}
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Current Course</h4>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">Advanced React Patterns</h5>
                      <p className="text-sm text-gray-600">Next: Custom Hooks Deep Dive</p>
                      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: "78%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="px-6 pb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {[
                    "Practice hooks with real projects",
                    "Review state management concepts",
                    "Build portfolio component"
                  ].map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 hover:translate-x-1 transition-transform duration-300"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 rounded-2xl bg-gray-900/10 shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section with Micro-animations */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Lightbulb className="mr-2 h-4 w-4" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced features designed to make learning more effective,
              engaging, and personalized.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI-Powered Learning",
                description:
                  "Personalized learning paths that adapt to your progress and learning style using advanced machine learning algorithms.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: ChartBar,
                title: "Real-Time Analytics",
                description:
                  "Track your progress with detailed insights, performance metrics, and predictive analytics to optimize your learning journey.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Code,
                title: "Interactive Coding",
                description:
                  "Practice coding with instant feedback, AI-powered hints, and real-world projects that build your portfolio.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Users,
                title: "Collaborative Learning",
                description:
                  "Connect with peers, join study groups, and participate in live coding sessions with expert instructors.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Target,
                title: "Goal Tracking",
                description:
                  "Set learning goals, track milestones, and receive personalized recommendations to achieve your objectives faster.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description:
                  "Enterprise-grade security with encrypted data storage, privacy controls, and compliance with educational standards.",
                color: "from-gray-600 to-gray-800",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="space-y-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color} text-white`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Award className="mr-2 h-4 w-4" />
              Pricing Plans
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Choose Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Learning Path
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Flexible pricing options designed for students, educators, and
              institutions.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$0",
                description: "Perfect for getting started",
                features: [
                  "Access to 50+ courses",
                  "Basic AI recommendations",
                  "Community support",
                  "Progress tracking",
                  "Mobile app access",
                ],
                color: "from-gray-500 to-gray-700",
                popular: false,
              },
              {
                name: "Professional",
                price: "$29",
                description: "Most popular choice",
                features: [
                  "Access to 500+ courses",
                  "Advanced AI learning paths",
                  "Priority support",
                  "1-on-1 mentoring sessions",
                  "Certificate of completion",
                  "Offline downloads",
                ],
                color: "from-blue-500 to-purple-600",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For teams and institutions",
                features: [
                  "Unlimited course access",
                  "Custom learning paths",
                  "Dedicated account manager",
                  "API access",
                  "White-label options",
                  "Advanced analytics",
                ],
                color: "from-purple-500 to-pink-600",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: plan.popular ? 1.02 : 1.05,
                  y: plan.popular ? -10 : -5,
                }}
                className="relative"
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                    <Star className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                )}
                <Card
                  className={`h-full ${
                    plan.popular
                      ? "border-2 border-blue-500 shadow-2xl"
                      : "border shadow-lg"
                  }`}
                >
                  <CardHeader className="text-center space-y-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${plan.color} text-white mx-auto`}
                    >
                      <Rocket className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <div className="space-y-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-gray-600">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/sign-up">
                        {plan.price === "Custom"
                          ? "Contact Sales"
                          : "Get Started"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <Badge variant="secondary" className="w-fit">
                <Globe className="mr-2 h-4 w-4" />
                About SkillSyncAI
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Transforming Education
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Through AI
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2024, SkillSyncAI is revolutionizing the way people
                learn by combining cutting-edge artificial intelligence with
                proven educational methodologies. Our platform adapts to each
                learner&apos;s unique style, pace, and goals.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { label: "Active Students", value: "10,000+" },
                  { label: "Success Rate", value: "94%" },
                  { label: "Expert Instructors", value: "500+" },
                  { label: "Countries", value: "50+" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Brain,
                    title: "AI-Driven",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Users,
                    title: "Community",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Target,
                    title: "Goal-Oriented",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: Shield,
                    title: "Secure",
                    color: "from-orange-500 to-red-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="p-6 rounded-xl bg-white border shadow-lg"
                  >
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${item.color} text-white mb-4`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Users className="mr-2 h-4 w-4" />
              Get In Touch
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s Build Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Learning Journey
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? Want to learn more? Our team is here to help you
              succeed.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Support",
                description: "Get help from our support team",
                contact: "support@skillsyncai.com",
                action: "Email Support",
              },
              {
                icon: Users,
                title: "Sales",
                description: "Discuss enterprise solutions",
                contact: "sales@skillsyncai.com",
                action: "Contact Sales",
              },
              {
                icon: Globe,
                title: "Community",
                description: "Join our learner community",
                contact: "community.skillsyncai.com",
                action: "Join Discord",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mx-auto"
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600 font-mono">
                      {item.contact}
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact">
                        {item.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Start Your Journey
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Join thousands of learners who are already using SkillSyncAI to
              achieve their goals faster and more effectively.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/demo">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillSyncAI
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Transforming education through AI-powered personalized learning
                experiences.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/features" className="hover:text-blue-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-blue-600">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-blue-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-blue-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy" className="hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-blue-600">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; 2024 SkillSyncAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
