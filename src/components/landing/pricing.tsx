/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/common/ui/button";
import { Card, CardContent, CardHeader } from "@/components/common/ui/card";
import { Badge } from "@/components/common/ui/badge";
import { Check, Star, Zap } from "lucide-react";
import { PRICING_PLANS } from "@/lib/utils/constants";
import { formatPrice } from "@/lib/utils/utils";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-2 text-sm text-muted-foreground"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <Star className="h-4 w-4 text-primary" />
            <span>Simple, Transparent Pricing</span>
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Choose your
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              learning journey
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start free, upgrade when you&lsquo;re ready. No hidden fees, no surprises. 
            Cancel anytime with just one click.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants as any}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card 
                className={`relative hover:shadow-2xl transition-all duration-500 ${
                  plan.popular 
                    ? 'border-primary shadow-xl scale-105 bg-gradient-to-b from-background to-primary/5' 
                    : 'hover:border-primary/50'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Star className="w-3 h-3 mr-1" />
                      </motion.div>
                      Most Popular
                    </Badge>
                  </motion.div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <motion.h3 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {plan.description}
                  </motion.p>
                  <motion.div 
                    className="mt-4"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
                  >
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/{plan.period}</span>
                      )}
                    </div>
                    {plan.price > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed monthly, cancel anytime
                      </p>
                    )}
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                      >
                        <motion.div 
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10"
                          whileHover={{ scale: 1.2, backgroundColor: "hsl(var(--primary))" }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Check className="h-3 w-3 text-primary" />
                        </motion.div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href="/sign-up">
                        {plan.buttonText}
                        {plan.popular && (
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <Zap className="ml-2 h-4 w-4" />
                          </motion.div>
                        )}
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Additional Info */}
                  {plan.price === 0 && (
                    <motion.p 
                      className="text-xs text-center text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      No credit card required
                    </motion.p>
                  )}
                  {plan.popular && (
                    <motion.p 
                      className="text-xs text-center text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      14-day free trial • No setup fees
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-4 rounded-2xl border bg-muted/30 p-6 hover:bg-muted/50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="text-left">
              <div className="font-semibold">Have questions about pricing?</div>
              <div className="text-sm text-muted-foreground">
                Our team is here to help you find the perfect plan
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm">
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">Trusted by learners worldwide</p>
          <motion.div 
            className="flex justify-center items-center gap-6 text-xs text-muted-foreground"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="flex items-center gap-1"
              variants={cardVariants as any}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </motion.div>
            <motion.span variants={cardVariants as any}>•</motion.span>
            <motion.div variants={cardVariants as any}>99.9% uptime</motion.div>
            <motion.span variants={cardVariants as any}>•</motion.span>
            <motion.div variants={cardVariants as any}>SSL encrypted</motion.div>
            <motion.span variants={cardVariants as any}>•</motion.span>
            <motion.div variants={cardVariants as any}>GDPR compliant</motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

