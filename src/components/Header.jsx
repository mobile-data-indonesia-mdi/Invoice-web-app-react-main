import React, { useState } from 'react'
import logo from '../assets/logo_mdi.png';
import sun from '../assets/icon-sun.svg'
import moon from '../assets/icon-moon.svg'
import useDarkMode from '../hooks/useDarkMode';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(false);
  const toggleDarkMode = () => {
    const newTheme = colorTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setDarkSide(newTheme === "light");
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const transition = {
    type: "spring",
    stiffness: 200,
    damping: 10
  };

  // Ambil semua invoice dari Redux
  const invoices = useSelector((state) => state.invoices?.allInvoice || []);

  // Hitung total piutang dari invoice yang belum dibayar
  const totalUnpaid = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'unpaid')
    .reduce((acc, curr) => {
      const items = curr.item || []; 
      const totalItem = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
      return acc + totalItem;
    }, 0);

  return (
    <header className="fixed w-full top-0 left-0 z-50 flex justify-between items-center px-6 py-3 bg-white dark:bg-[#1E2139] shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} className="h-10 mr-4" alt="logo" />
        <span className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:inline">InvoiceApp</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme */}
        {colorTheme === "light" ? (
          <motion.img
            onClick={toggleDarkMode}
            initial={{ scale: 0.6, rotate: 90 }}
            animate={{ scale: 1, rotate: 360, transition }}
            whileTap={{ scale: 0.9, rotate: 15 }}
            src={moon}
            className='cursor-pointer h-5'
            alt="dark-mode-icon"
          />
        ) : (
          <motion.img
            onClick={toggleDarkMode}
            whileTap={{ scale: 0.9, rotate: 15 }}
            initial={{ rotate: 45 }}
            animate={{ rotate: 360, transition }}
            src={sun}
            className='cursor-pointer h-5'
            alt="light-mode-icon"
          />
        )}

        {/* Profile */}
        <div className='flex items-center gap-2'> 
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;
