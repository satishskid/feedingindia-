import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaHome, 
  FaUsers, 
  FaChartBar, 
  FaChartLine, 
  FaEdit,
  FaChartPie,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';

const navigation = [
  { name: 'Dashboard', href: '/', icon: FaHome },
  { name: 'Children Data', href: '/children', icon: FaUsers },
  { 
    name: 'Statistics', 
    href: '/analysis', 
    icon: FaChartBar,
    subItems: [
      { name: 'Population Analysis', href: '/analysis/population' },
      { name: 'Growth Trends', href: '/analysis/trends' },
      { name: 'Intervention Impact', href: '/analysis/interventions' }
    ]
  },
  { 
    name: 'Visualizations', 
    href: '/visualizations', 
    icon: FaChartLine,
    subItems: [
      { name: 'Height-for-Age', href: '/visualizations/height-for-age' },
      { name: 'Weight-for-Age', href: '/visualizations/weight-for-age' }
    ]
  },
  { name: 'Data Entry', href: '/data-entry', icon: FaEdit },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const isSubItemActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm overflow-y-auto">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              <div
                className={`${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer`}
                onClick={() => {
                  if (item.subItems) {
                    toggleExpand(item.name);
                  } else {
                    router.push(item.href);
                  }
                }}
              >
                <item.icon
                  className={`${
                    isActive(item.href) ? 'text-blue-600' : 'text-gray-400'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                />
                <span className="flex-1">{item.name}</span>
                {item.subItems && (
                  expandedItems.includes(item.name) ? (
                    <FaChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <FaChevronRight className="h-4 w-4 text-gray-400" />
                  )
                )}
              </div>
              {item.subItems && expandedItems.includes(item.name) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`${
                        isSubItemActive(subItem.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
