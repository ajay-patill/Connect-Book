import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import {
  GraduationCap,
  Users,
  FileText,
  Calendar,
  BookOpen,
  BarChart,
} from 'lucide-react';

export function Home() {
  const { user } = useAuthStore();

  const features = user?.role === 'teacher'
    ? [
        { icon: GraduationCap, title: 'Grade Master', description: 'Manage student grades and documents', link: '/grade-master' },
        { icon: Users, title: 'Smart Attendance', description: 'Track student attendance efficiently', link: '/attendance' },
        { icon: FileText, title: 'Lecture Notes', description: 'Record and manage lecture transcriptions', link: '/lectures' },
        { icon: Calendar, title: 'Mentor Connect', description: 'Connect with parents and schedule meetings', link: '/mentor' },
      ]
    : user?.role === 'student'
    ? [
        { icon: GraduationCap, title: 'My Grades', description: 'View your academic performance', link: '/grades' },
        { icon: Users, title: 'Attendance', description: 'Mark and track your attendance', link: '/attendance' },
        { icon: BarChart, title: 'Career Adviser', description: 'Get personalized career guidance', link: '/career' },
        { 
          icon: BookOpen, 
          title: 'Course Master', 
          description: 'Explore domain-specific courses', 
          link: 'https://sites.google.com/view/coursesmaster/' // Add the external link here
        },
        { 
          icon: BookOpen, 
          title: 'Quick Attendance', 
          description: 'Explore user-specific Attendance', 
          link: 'https://sites.google.com/view/quickattend' // Add the external link here
        },
        { 
          icon: Calendar, 
          title: 'Interview & Internship Simulator', 
          description: 'Practice mock interviews & get domain-specific tasks', 
          link: 'http://localhost:5173' // External React app link
        }
      ]
    : [
        { icon: BookOpen, title: 'Academic Dashboard', description: 'Track your child\'s academic progress', link: '/dashboard' },
        { icon: Calendar, title: 'Mentor Connect', description: 'Connect with teachers', link: '/mentor' },
      ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ConnectBook</h1>
          <p className="text-xl text-gray-600">Your comprehensive education management platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}