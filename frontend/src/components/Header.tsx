import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, Bell, Settings, MessageSquare, CreditCard, AlertTriangle, Calendar, User, Shield, LogOut } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

type HeaderProps = {
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
};


function Header({ onToggleSidebar, title, subtitle }: HeaderProps) {

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Fecha Notification se clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setIsNotificationOpen(false);
            }
            if (
                settingsRef.current &&
                !settingsRef.current.contains(event.target as Node)
            ) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 h-[85px]">
                <div className="flex items-center justify-between flex-wrap gap-4 header-content">
                    <div className="flex items-center flex-1 min-w-0">
                        {/* Hamburger Menu Button (visible on mobile/tablet) */}
                        <button id="sidebar-toggle" 
                            onClick={onToggleSidebar} 
                            className="hamburger-btn mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Menu className="w-5 h-5 dark:text-gray-300" />
                        </button>
                        <div className="min-w-0">
                            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white truncate">{title}</h2>
                            {subtitle && (
                                <p className="text-xs sm:text-sm font-body text-gray-500 dark:text-gray-400 mt-1 truncate">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 header-actions flex-shrink-0">
                        <div className="relative search-container hidden sm:block">
                            <input type="text" placeholder="Procurar ..." className="w-40 md:w-48 lg:w-60 px-4 py-2 pl-10 pr-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                        <button id="mobile-search-btn" className="sm:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        {/* Theme toggle button */}
                        <ThemeToggle />

                        {/* Notification Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button id="notification-btn" className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Notification Dropdown Menu */}
                            {isNotificationOpen && (
                                <div id="notification-dropdown" className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2 glass-effect">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <h3 className="font-display font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                        <button className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">Mark all as read</button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">New appointment scheduled</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">John Smith booked an appointment for tomorrow at 10:00 AM</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 minutes ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <AlertTriangle className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Critical lab result</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Patient #2847 has abnormal test results requiring review</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">15 minutes ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CreditCard className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Payment received</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Invoice #INV-2024-0189 has been paid by Robert Johnson</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <MessageSquare className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">New message from patient</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Miller sent a new message regarding her prescription</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">3 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                                        <Link to="#" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">View all notifications</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings Dropdown */}
                        <div className="relative" ref={settingsRef}>
                            <button id="settings-btn"
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            >
                                <Settings className="w-5 h-5" />
                            </button>

                            {/* Settings Dropdown Menu */}
                            {isSettingsOpen && (
                                <div id="settings-dropdown" className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2 glass-effect">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="font-display font-semibold text-gray-900 dark:text-white">Settings</h3>
                                    </div>
                                    <div className="py-2">
                                        <Link to="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <User className="w-4 h-4 mr-3" />
                                            Profile Settings
                                        </Link>
                                        <Link to="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <Bell className="w-4 h-4 mr-3" />
                                            Notifications
                                        </Link>
                                        <Link to="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <Shield className="w-4 h-4 mr-3" />
                                            Privacy & Security
                                        </Link>
                                        <Link to="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <CreditCard className="w-4 h-4 mr-3" />
                                            Billing
                                        </Link>
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                        <Link to="/sair" className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sair
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar (hidden by default) */}
                <div id="mobile-search-container" className="hidden bg-white absolute left-0 w-full right-0 px-4 pb-2 top-[75px] z-[999]">
                    <div className="relative">
                        <input type="search" placeholder="Search..."
                            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                        <i data-lucide="search" className="w-4 h-4 text-gray-400 absolute left-3 top-3"></i>
                    </div>
                </div>

            </header>
        </>
    );
}
export default Header;
