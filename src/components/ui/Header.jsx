import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/logo_mdi_no_words.png";
import sun from "@/assets/icon-sun.svg";
import moon from "@/assets/icon-moon.svg";
import useDarkMode from "@/hooks/useDarkMode.js";

import useAuth from "@/hooks/useAuth.js";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(false);

  const toggleDarkMode = () => {
    const newTheme = colorTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setDarkSide(newTheme === "light");
  };

  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const transition = {
    type: "spring",
    stiffness: 200,
    damping: 10,
  };


  return (
    <header className="fixed w-full top-0 left-0 z-50 flex justify-between items-center px-6 py-3 bg-white dark:bg-[#1E2139] shadow-md">
      {/* Logo */}
      <div className="flex items-center hover:cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} className="h-10 mr-2" alt="logo" />
        <div className="flex flex-col items-center">
          <span className="text-xl font-tektur font-semibold dark:text-white hidden sm:inline">
            InvoiceApp
          </span>
          <span className="text-xs dark:text-gray-300 hidden sm:inline">
            Mobile Data Indonesia
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <span className="text-lg text-gray-500 dark:text-white hidden sm:inline">
          {auth.user.username} | {auth.user.role}
        </span>
        {/* Toggle Theme */}
        {colorTheme === "light" ? (
          <motion.img
            onClick={toggleDarkMode}
            initial={{ scale: 0.6, rotate: 90 }}
            animate={{ scale: 1, rotate: 360, transition }}
            whileTap={{ scale: 0.9, rotate: 15 }}
            src={moon}
            className="cursor-pointer h-5"
            alt="dark-mode-icon"
          />
        ) : (
          <motion.img
            onClick={toggleDarkMode}
            whileTap={{ scale: 0.9, rotate: 15 }}
            initial={{ rotate: 45 }}
            animate={{ rotate: 360, transition }}
            src={sun}
            className="cursor-pointer h-5"
            alt="light-mode-icon"
          />
        )}

        {/* Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="text-lg text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
