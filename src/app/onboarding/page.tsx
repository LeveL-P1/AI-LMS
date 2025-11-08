"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/ui/card";
import { GraduationCap, BookOpen, Users, Settings, ArrowRight } from "lucide-react";

const roles = [
  {
    id: "student",
    title: "Student",
    description: "I want to learn new skills and take courses",
    icon: BookOpen,
    features: [
      "Access to all courses",
      "AI-powered recommendations",
      "Progress tracking",
      "Interactive quizzes",
      "Mobile learning"
    ],
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
    popular: true
  },
  {
    id: "instructor",
    title: "Instructor", 
    description: "I want to create and teach courses",
    icon: Users,
    features: [
      "Create unlimited courses",
      "Student analytics",
      "Auto-generate quizzes",
      "Revenue sharing",
      "Course builder tools"
    ],
    color: "text-green-600 bg-green-100 dark:bg-green-900/20",
    popular: false
  },
  {
    id: "admin",
    title: "Admin",
    description: "I want to manage the platform",
    icon: Settings,
    features: [
      "Platform management",
      "User administration",
      "Analytics dashboard",
      "Content moderation",
      "System configuration"
    ],
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
    popular: false
  }
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;
    
    setLoading(true);
    
    try {
      // Map role to database format
      const roleMap = {
        'student': 'STUDENT',
        'instructor': 'INSTRUCTOR',
        'admin': 'ADMIN'
      };

      // Update user role in database and Clerk metadata
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: roleMap[selectedRole as keyof typeof roleMap]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Redirect based on role
      const redirectPath = selectedRole === 'admin' ? '/dashboard/admin' : 
                          selectedRole === 'instructor' ? '/dashboard/instructor' : 
                          '/dashboard/student';
      
      router.push(redirectPath);
    } catch (error) {
      console.error("Error updating user role:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-bold text-3xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              SkillSyncAI
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome aboard! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let&lsquo;s personalize your experience. Choose your role to get started with features tailored just for you.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole === role.id
                  ? 'border-primary shadow-lg scale-105 bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
           
              
              <CardHeader className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${role.color} mx-auto mb-4`}>
                  <role.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{role.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className="px-8"
          >
            {loading ? (
              "Setting up your dashboard..."
            ) : (
              <>
                Continue as {selectedRole && roles.find(r => r.id === selectedRole)?.title}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          
          {selectedRole && (
            <p className="text-sm text-muted-foreground mt-4">
              You can always change your role later in settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
