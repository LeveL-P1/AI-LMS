/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <motion.div 
          className="flex flex-col items-center text-center space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Learning Experience</span>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={fadeInUp} className="space-y-4 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Master Any Skill with
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                AI-Powered Learning
              </motion.span>
            </h1>
            <motion.p 
              className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl"
              variants={fadeInUp}
            >
              Transform your education with personalized learning paths, interactive quizzes, 
              and real-time AI feedback. Join thousands of learners achieving their goals.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/sign-up">
                  Start Learning Free
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-8 pt-8 text-center"
          >
            {[
              { icon: Users, value: "10K+", label: "Active Students" },
              { icon: BookOpen, value: "500+", label: "Expert Courses" },
              { icon: Trophy, value: "95%", label: "Success Rate" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            variants={fadeInUp}
            className="pt-8"
          >
            <motion.p 
              className="text-sm text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Trusted by learners from
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-6 opacity-60"
              variants={staggerContainer}
            >
              {["Google", "Microsoft", "Apple", "Netflix", "Spotify"].map((company, index) => (
                <motion.div 
                  key={company}
                  className="text-lg font-semibold hover:opacity-100 transition-opacity cursor-default"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1 }}
                >
                  {company}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}