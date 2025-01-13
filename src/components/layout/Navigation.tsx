import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaChartLine, FaUsers, FaClipboardList, FaCog } from 'react-icons/fa';

export default function Navigation() {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: FaChartLine
    },
    {
      name: 'Population Analysis',
      href: '/analysis/population',
      icon: FaUsers
    },
    {
      name: 'Interventions',
      href: '/interventions',
      icon: FaClipboardList
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: FaCog
    }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                CGM Analytics
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
