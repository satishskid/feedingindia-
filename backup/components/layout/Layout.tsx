import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/children', label: 'Children Data', icon: '👶' },
    { 
      path: '/analysis', 
      label: 'Analysis', 
      icon: '📊',
      submenu: [
        { path: '/analysis/population', label: 'Population Analysis' },
        { path: '/analysis/trends', label: 'Growth Trends' },
        { path: '/analysis/interventions', label: 'Intervention Impact' }
      ]
    },
    { 
      path: '/visualizations',
      label: 'Visualizations',
      icon: '📈',
      submenu: [
        { path: '/visualizations/height-for-age', label: 'Height-for-Age' },
        { path: '/visualizations/weight-for-age', label: 'Weight-for-Age' }
      ]
    },
    { path: '/data-entry', label: 'Data Entry', icon: '✏️' },
    { path: '/programs', label: 'Programs', icon: '📋' },
    { path: '/programs/batch-upload', label: 'Batch Upload', icon: '📤' },
    { path: '/documentation', label: 'Documentation', icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg overflow-y-auto">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Child Growth Monitor
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
                {item.submenu && (
                  <ul className="ml-8 mt-2 space-y-2">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className={`block p-2 rounded-lg transition-colors ${
                            isActive(subItem.path)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
