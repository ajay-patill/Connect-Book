import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  FileText,
  Calendar,
  BookOpen,
  HelpCircle,
  BarChart,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth';

const teacherLinks = [
  { href: '/grade-master', label: 'Grade Master', icon: GraduationCap },
  { href: '/attendance', label: 'Smart Attendance', icon: Users },
  { href: '/lectures', label: 'Lecture Notes', icon: FileText },
  { href: '/mentor', label: 'Mentor Connect', icon: Calendar },
];

const studentLinks = [
  { href: '/grades', label: 'My Grades', icon: GraduationCap },
  { href: '/attendance', label: 'Attendance', icon: Users },
  { href: '/career', label: 'Career Adviser', icon: BarChart },
];

const parentLinks = [
  { href: '/parent-dashboard', label: 'Academic Dashboard', icon: BookOpen },
  { href: '/mentor', label: 'Mentor Connect', icon: Calendar },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();

  const links = user?.role === 'teacher'
    ? teacherLinks
    : user?.role === 'student'
    ? studentLinks
    : parentLinks;

  return (
    <div className="h-full w-64 bg-white border-r">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname === link.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <Link
          to="/faq"
          className={cn(
            'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            location.pathname === '/faq'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          <HelpCircle className="h-5 w-5" />
          <span>FAQ</span>
        </Link>
      </nav>
    </div>
  );
}