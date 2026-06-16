import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Users, Store, Key, ShoppingBag } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar, toggleSidebar }) => {
  const { user } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', Icon: LayoutDashboard },
          { name: 'Manage Users', path: '/admin/users', Icon: Users },
          { name: 'Manage Stores', path: '/admin/stores', Icon: Store }
        ];
      case 'store_owner':
        return [
          { name: 'Dashboard', path: '/owner/dashboard', Icon: LayoutDashboard }
        ];
      case 'user':
        return [
          { name: 'Browse Stores', path: '/user/stores', Icon: ShoppingBag }
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  links.push({ name: 'Change Password', path: '/change-password', Icon: Key });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={closeSidebar}></div>
      )}

      {/* Sidebar relative to the new layout */}
      <div 
        className={`absolute lg:relative z-40 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20 w-64'}`}
      >
        <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="flex-1 px-3 space-y-2 mt-4">
            {links.map((link) => {
              const Icon = link.Icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  title={link.name}
                  onClick={() => { if(window.innerWidth < 1024) closeSidebar() }}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium'
                    } ${!isOpen && 'lg:justify-center px-2'}`
                  }
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-all ${isOpen ? 'mr-3' : 'lg:mr-0 mr-3'}`} strokeWidth={2.5} />
                  <span className={`transition-all duration-200 ${isOpen ? 'opacity-100 w-auto visible' : 'lg:opacity-0 lg:w-0 lg:invisible overflow-hidden'}`}>
                    {link.name}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
