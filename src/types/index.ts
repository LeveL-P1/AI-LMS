// User types
export enum UserRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR", 
  ADMIN = "ADMIN"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId?: string;
  instructor?: User;
  duration?: number; // in minutes
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation types
export interface NavLink {
  href: string;
  label: string;
}

// Feature types for landing page
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

// Pricing plan types
export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}

