import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MoonIcon, SunIcon, HomeIcon, UserIcon, ShoppingCartIcon,
  ChartBarIcon, BriefcaseIcon, EyeIcon, LogoutIcon, UserCircleIcon
} from '@heroicons/react/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const navigate = useNavigate(); // Hook for navigation

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);


  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  return (
      <div>
      <aside className={`fixed sidebar inset-y-0 block-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 ${darkMode ? 'bg-slate-800' : 'bg-white'} border-0 shadow-xl dark:shadow-none max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0`} aria-expanded="false">
        <div className="h-19">
          <i className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times dark:text-white text-gray-400 xl:hidden"></i>
          <Link to="" className="block px-8 py-6 m-0 text-sm whitespace-nowrap dark:text-white text-gray-700">
            <span className="ml-12 font-bold text-lg text-center text-white dark:text-white" style={{ fontFamily: 'monospace' }}>A~OPTIC~I</span>
          </Link>
        </div>
        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">
            <li className="mt-0.5 w-full">
              <Link to="/admin/Adminhome" className="py-2.7 bg-gray-200 dark:bg-gray-700  dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                <div className="mr-2 flex h-11 w-11 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                  <HomeIcon className="w-6 h-6 text-blue-500 dark:text-white" />
                </div>
                <span className="ml-1 text-font-bold text-cyan-900 dark:text-white text-base" style={{ fontFamily: 'monospace' }}>DASHBOARD</span>
              </Link>
            </li>

            <li className="mt-0.5 w-full">
              <Link to="/admin/commands" className="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors">
                <div className="mr-2 flex h-11 w-11 items-center justify-center rounded-lg bg-center fill-current stroke-0 text-center xl:p-2.5">
                  <ShoppingCartIcon className="w-6 h-6 text-cyan-600 dark:text-white" />
                </div>
                <span className="ml-1 font-bold text-cyan-800 dark:text-white text-base" style={{ fontFamily: 'monospace' }}>COMMANDS</span>
              </Link>
            </li>

            <li className="mt-0.5 w-full">
              <Link to="/admin/client" className="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors">
                <div className="mr-2 flex h-11 w-11 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                  <UserIcon className="w-6 h-6 text-cyan-600 dark:text-white" />
                </div>
                <span className="ml-1 font-bold text-cyan-800 dark:text-white text-base" style={{ fontFamily: 'monospace' }}>CLIENT</span>
              </Link>
            </li>

            <li className="mt-0.5 w-full">
              <Link to="/admin/fournisseurs" className="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors">
                <div className="mr-2 flex h-11 w-11 items-center justify-center rounded-lg bg-center fill-current stroke-0 text-center xl:p-2.5">
                  <BriefcaseIcon className="w-6 h-6 text-cyan-600 dark:text-white" />
                </div>
                <span className="ml-1 font-bold text-cyan-800 dark:text-white text-base" style={{ fontFamily: 'monospace' }}>FOURNISSEURS</span>
              </Link>
            </li>

            <li className="mt-0.5 w-full">
              <Link to="/admin/typeVerre" className="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors">
                <div className="mr-2 flex h-11 w-11 items-center justify-center rounded-lg bg-center fill-current stroke-0 text-center xl:p-2.5">
                  <EyeIcon className="w-6 h-6 text-cyan-600 dark:text-white" />
                </div>
                <span className="ml-1 font-bold text-cyan-800 dark:text-white text-base" style={{ fontFamily: 'monospace' }}>TYPE VERRES</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Profile Button */}
        <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={handleProfileClick}
            className="p-2 rounded-full bg-cyan-700 text-white shadow-lg hover:bg-cyan-600 transition"
          >
            <UserCircleIcon className="h-6 w-6" />
          </button>

          {/* Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-cyan-700 text-white shadow-lg hover:bg-cyan-600 transition"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
