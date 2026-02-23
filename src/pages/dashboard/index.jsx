import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Award,
    Image,
    LogOut,
    Menu,
    X,
    Phone,
    UserPlus,
    Wrench,
    Palette
} from 'lucide-react';

import ProjectsManager from './ProjectsManager';
import CertificatesManager from './CertificatesManager';
import CareersManager from './CareersManager';
import SlidersManager from './SlidersManager';
import ContactManager from './ContactManager';
import ServicesManager from './ServicesManager';
import SettingsManager from './SettingsManager';
import UsersManager from './UsersManager';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('careers'); // Default to Careers as per request
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isMainAdmin = user && (user.role === 'Main Admin' || (Array.isArray(user.role) && user.role.includes('Main Admin')) || user.role === 'SuperAdmin');

    const menuItems = [
        { id: 'projects', label: 'Projects', icon: LayoutDashboard, component: ProjectsManager },
        { id: 'certificates', label: 'Certificates', icon: Award, component: CertificatesManager },
        { id: 'careers', label: 'Careers', icon: Briefcase, component: CareersManager },
        { id: 'sliders', label: 'Sliders', icon: Image, component: SlidersManager },
        { id: 'services', label: 'Services', icon: Wrench, component: ServicesManager },
        { id: 'contact', label: 'Contact Info', icon: Phone, component: ContactManager },
        { id: 'settings', label: 'Settings', icon: Palette, component: SettingsManager },
    ];

    if (isMainAdmin) {
        menuItems.splice(menuItems.length - 1, 0, { id: 'users', label: 'Administrators', icon: UserPlus, component: UsersManager });
    }

    const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || ProjectsManager;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <motion.div
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-white shadow-xl z-20 hidden md:flex flex-col fixed h-full transition-all duration-300"
            >
                <div className="p-6 flex items-center justify-between border-b">
                    {isSidebarOpen && <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded hover:bg-gray-100 text-gray-600">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 pt-6 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === item.id
                                ? 'sidebar-active translate-x-1'
                                : 'text-gray-600 sidebar-hover'
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-white' : ''} />
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-2">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'
                            }`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Sidebar Overlay */}
            {/* For simplicity in this iteration, we focus on the desktop integration requested. Mobile users can rely on standard scrolling or we add a drawer later. */}

            {/* Main Content */}
            <div className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? 'md:ml-[260px]' : 'md:ml-[80px]'}`}>
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your website content</p>

                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                    </div>
                </header>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ActiveComponent />
                </motion.div>
            </div>
        </div>
    );
}
