import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ selectedMenu, onMenuSelect }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        { key: 'dashboard', label: 'Dashboard', path: '/' },
        { key: 'invoices', label: 'Invoices', path: '/invoices' },
        { key: 'payments', label: 'Payments', path: '/payments' },
        { key: 'report', label: 'Report', path: '/report' }, // Tambahkan menu Report
    ];

    // Sinkronkan `selectedMenu` dengan rute aktif
    useEffect(() => {
        const currentMenu = menus.find((menu) => menu.path === location.pathname);
        if (currentMenu) {
            onMenuSelect(currentMenu.key);
        } else if (location.pathname === '/') {
            onMenuSelect('dashboard'); // Atur ke dashboard jika rute adalah "/"
        }
    }, [location.pathname, menus, onMenuSelect]);

    return (
        <aside className="w-48 bg-white dark:bg-[#1E2139] h-screen shadow-lg p-4">
            <ul className="space-y-4">
                {menus.map((menu) => (
                    <li
                        key={menu.key}
                        onClick={() => {
                            console.log('Navigating to:', menu.path);
                            onMenuSelect(menu.key);
                            navigate(menu.path);
                        }}
                        className={`cursor-pointer p-2 rounded ${
                            selectedMenu === menu.key
                                ? 'bg-purple-500 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2b2c37]'
                        }`}
                    >
                        {menu.label}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
