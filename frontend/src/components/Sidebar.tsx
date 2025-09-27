import React, { useState } from "react";
 import { Link } from "react-router-dom";
import { Activity, LayoutDashboard, Users, Calendar, CreditCard, FlaskConical, UserCheck, BarChart3, ListFilter, ListRestart, Circle, RotateCcw, StickyNote, Columns2,LogOut  } from "lucide-react";


function Sidebar() {

    const [open, setOpen] = useState(false);

    return (
        <>
            <div id="sidebar" className="w-72 bg-white dark:bg-gray-800 shadow-premium border-r border-gray-200 dark:border-gray-700">
                <div className="flex flex-col h-full">
                    {/* Logo and Close Button Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center h-[85px]">
                        <div>
                            <a href="index.html" className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">CuraPanel</h1>
                                    <p className="text-sm font-body text-gray-500 dark:text-gray-400">Healthcare Admin</p>
                                </div>
                            </a>
                        </div>
                        <button id="sidebar-close" className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i data-lucide="x" className="w-5 h-5 dark:text-gray-300"></i>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                        <ul className="space-y-2">
                            <li>
                                <a href="index.html" className="active flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-purple-700 dark:text-primary-300 font-medium shadow-sm transition-all">
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="patients.html" className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200">
                                    <Users className="w-5 h-5" />
                                    <span>Patients</span>
                                </a>
                            </li>
                            <li>
                                <a href="appointments.html" className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200">
                                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Appointments</span>
                                </a>
                            </li>
                            <li>
                                <a href="billing.html" className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200">
                                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Billing</span>
                                </a>
                            </li>
                            <li>
                                <a href="lab-results.html" className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200">
                                    <FlaskConical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Lab Results</span>
                                </a>
                            </li>
                            <li>
                                <a href="staff.html" className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200">
                                    <UserCheck className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Staff</span>
                                </a>
                            </li>
                            <li>
                                <a href="reports.html" className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200">
                                    <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Reports</span>
                                </a>
                            </li>
                            <li>
                                <button
                                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200"
                                    onClick={() => setOpen(!open)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <ListFilter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <span>Pages</span>
                                    </div>
                                    {/* Chevron rotaciona quando aberto */}
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <ul className={`mt-1 space-y-1 ${open ? "block" : "hidden"}`}>
                                    <li>
                                        <a href="/login" className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center space-x-3">
                                            <ListRestart className="w-5 h-5" />
                                            <span>Login</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/signup" className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center space-x-3">
                                            <Circle className="w-5 h-5" />
                                            <span>Signup</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/forgot-password" className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center space-x-3">
                                            <RotateCcw className="w-5 h-5" />
                                            <span>Forgot password</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/404" className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center space-x-3">
                                            <StickyNote className="w-5 h-5" />
                                            <span>404 page</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/500" className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center space-x-3">
                                            <Columns2 className="w-5 h-5" />
                                            <span>500 page</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>

                    {/* User Profile */}
                    <div className="border-t border-gray-200 dark:border-gray-700 h-20 flex items-center p-4">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 w-full">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">DR</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-display font-semibold text-gray-900 dark:text-white">Dr. Wilson</p>
                                <p className="text-xs font-body text-gray-500 dark:text-gray-400">Chief Medical Officer</p>
                            </div>
                            <Link to="#"><LogOut className="w-4 h-4 text-gray-400" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
