import React, { useEffect,useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, CalendarCheck, TrendingUp, FlaskConical, UserPlus, CalendarPlus, FilePlus, AlertTriangle, Clock, Check, AlertCircle,X } from "lucide-react";

function Dashboard() {
    const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
        setHeaderTitle: (title: string) => void;
        setHeaderSubtitle: (subtitle: string) => void;
    }>();

    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);


    // Define o título e subtítulo quando a página é carregada
    useEffect(() => {
        setHeaderTitle("Dashboard");
        setHeaderSubtitle("Welcome back, Dr. Wilson.");
    }, [setHeaderTitle, setHeaderSubtitle]);

    return (
        <>
            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 metrics-grid">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 hover-lift animate-slide-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-body font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                                <p className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">2,847</p>
                                <p className="text-xs sm:text-sm font-body text-green-600 dark:text-green-400 mt-1">↗ +12% from last month</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 hover-lift animate-slide-in" style={{ animationDelay: "0.1s" }} >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-body font-medium text-gray-600 dark:text-gray-400">Today's Appointments</p>
                                <p className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">47</p>
                                <p className="text-xs sm:text-sm font-body text-orange-600 dark:text-orange-400 mt-1">8 pending confirmations</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 hover-lift animate-slide-in" style={{ animationDelay: "0.2s" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-body font-medium text-gray-600 dark:text-gray-400">Revenue (MTD)</p>
                                <p className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">$284K</p>
                                <p className="text-xs sm:text-sm font-body text-green-600 dark:text-green-400 mt-1">↗ +8.2% vs target</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 hover-lift animate-slide-in" style={{ animationDelay: "0.3s" }} >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-body font-medium text-gray-600 dark:text-gray-400">Lab Results Pending</p>
                                <p className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">23</p>
                                <p className="text-xs sm:text-sm font-body text-red-600 dark:text-red-400 mt-1">5 urgent reviews</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 main-content-grid">
                    {/* Recent Appointments */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.4s;" }} >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-display font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
                            <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-body font-medium text-xs sm:text-sm">View All</button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs sm:text-sm">JD</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-display font-semibold text-gray-900 dark:text-white truncate">John Davis</p>
                                    <p className="text-xs sm:text-sm font-body text-gray-500 dark:text-gray-400 truncate">Cardiology Consultation</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-body font-medium text-gray-900 dark:text-white text-xs sm:text-sm">9:00 AM</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Confirmed</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs sm:text-sm">SM</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-display font-semibold text-gray-900 dark:text-white truncate">Miller</p>
                                    <p className="text-xs sm:text-sm font-body text-gray-500 dark:text-gray-400 truncate">Annual Physical Exam</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-body font-medium text-gray-900 dark:text-white text-xs sm:text-sm">10:30 AM</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs sm:text-sm">RJ</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-display font-semibold text-gray-900 dark:text-white truncate">Robert Johnson</p>
                                    <p className="text-xs sm:text-sm font-body text-gray-500 dark:text-gray-400 truncate">Follow-up Appointment</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-body font-medium text-gray-900 dark:text-white text-xs sm:text-sm">2:15 PM</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Confirmed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions & Alerts */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.5s" }} >
                            <h3 className="text-base sm:text-lg font-display font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h3>
                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    onClick={() => setIsAddPatientModalOpen(true)}
                                    data-modal-target="addPatientModal"
                                     className="w-full flex items-center space-x-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 text-purple-700 dark:text-primary-300 transition-colors">
                                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-body font-medium text-xs sm:text-sm">Add New Patient</span>
                                </button>
                                <button data-modal-target="AddAppointmentModal" className="w-full flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 transition-colors">
                                    <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-body font-medium text-xs sm:text-sm">Schedule Appointment</span>
                                </button>
                                <button data-modal-target="createInvoiceModal" className="w-full flex items-center space-x-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 transition-colors">
                                    <FilePlus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-body font-medium text-xs sm:text-sm">Create Invoice</span>
                                </button>
                            </div>
                        </div>

                        {/* Urgent Alerts */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.6s" }}>
                            <h3 className="text-base sm:text-lg font-display font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Urgent Alerts</h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                        <div>
                                            <p className="font-body font-medium text-red-900 dark:text-red-100 text-xs sm:text-sm">Critical Lab Result</p>
                                            <p className="text-xs text-red-700 dark:text-red-300">Patient #2847 requires immediate attention</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                                    <div className="flex items-start space-x-3">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div>
                                            <p className="font-body font-medium text-yellow-900 dark:text-yellow-100 text-xs sm:text-sm">Overdue Payment</p>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300">Invoice #INV-2024-0156 is 30 days overdue</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 bottom-section-grid">
                    {/* Recent Lab Results */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.7s" }}>
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-display font-semibold text-gray-900 dark:text-white">Recent Lab Results</h3>
                            <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-body font-medium text-xs sm:text-sm">View All</button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">Blood Panel - Emma Wilson</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Completed 2 hours ago</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Normal</span>
                            </div>
                            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">X-Ray - Michael Chen</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Completed 4 hours ago</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Review</span>
                            </div>
                        </div>
                    </div>

                    {/* Staff Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.8s" }} >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-display font-semibold text-gray-900 dark:text-white">Staff Status</h3>
                            <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-body font-medium text-xs sm:text-sm">Manage</button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-xs sm:text-sm">AJ</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">Dr. Alex Johnson</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Cardiologist</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 status-online rounded-full"></div>
                                    <span className="text-xs sm:text-sm font-body font-medium text-green-700 dark:text-green-400">Available</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-xs sm:text-sm">LM</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">Dr. Lisa Martinez</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pediatrician</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 status-busy rounded-full"></div>
                                    <span className="text-xs sm:text-sm font-body font-medium text-yellow-700 dark:text-yellow-400">In Surgery</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-xs sm:text-sm">RB</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">Nurse Rachel Brown</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Head Nurse</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 status-online rounded-full"></div>
                                    <span className="text-xs sm:text-sm font-body font-medium text-green-700 dark:text-green-400">Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Patient Modal */}
            {/* MODAL 1 */}

                                            {/*tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50 hidden flex items-center justify-center z-50*/}   
            {isAddPatientModalOpen && (                    
                <div id="addPatientModal" className="tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50  flex items-center justify-center z-50">
                    <div className="tw-modal-dialog bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white" >Add New Patient</h3>
                            <button 
                                onClick={() => setIsAddPatientModalOpen(false)}
                                data-modal-close
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" >                               
                                <X className="w-6 h-6 dark:text-gray-300" />
                            </button>
                        </div>

                        <form id="addPatientForm" className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Personal Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >First Name *</label>
                                        <input type="text" name="firstName" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Last Name *</label>
                                        <input type="text" name="lastName" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Date of Birth *</label>
                                        <input type="date" name="dateOfBirth" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Gender</label>
                                        <select name="gender" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Blood Type</label>
                                        <select name="gender" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" >
                                            <option value="">Select Blood Type</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Marital Status</label>
                                        <select name="maritalStatus" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" >
                                            <option value="">Select Status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Phone Number *</label>
                                        <input type="tel" name="phone" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Email Address *</label>
                                        <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Address</label>
                                        <textarea name="address" rows={3} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Emergency Contact</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Contact Name</label>
                                        <input type="text" name="emergencyName" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Relationship</label>
                                        <input type="text" name="emergencyRelationship" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Contact Phone</label>
                                        <input type="tel" name="emergencyPhone" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div>
                                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Medical Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Allergies</label>
                                        <textarea name="allergies" rows={3} placeholder="List any known allergies..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Current Medications</label>
                                        <textarea name="medications" rows={3} placeholder="List current medications..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" ></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Medical History</label>
                                        <textarea name="medicalHistory" rows={3} placeholder="Brief medical history..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Information */}
                            <div>
                                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Insurance Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Insurance Provider</label>
                                        <input type="text" name="insuranceProvider" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Policy Number</label>
                                        <input type="text" name="policyNumber" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Group Number</label>
                                        <input type="text" name="group" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700" >
                                <button type="button" data-modal-close className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body" >Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors font-body">Add Patient</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TODO MODAL 2 */}

            {/* TODO MODAL 3 */}

        </>
    );
}

export default Dashboard;

