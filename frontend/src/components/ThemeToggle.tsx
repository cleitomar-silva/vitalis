import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    // Verifica o tema atual ao carregar
    useEffect(() => {
        const darkMode = localStorage.getItem("theme") === "dark";
        setIsDark(darkMode);
        updateHtmlClass(darkMode);
    }, []);

    const updateHtmlClass = (dark: boolean) => {
        const html = document.documentElement;
        if (dark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        updateHtmlClass(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    return (
        <>
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
                <Sun className="w-5 h-5 hidden dark:block text-gray-600 dark:text-gray-300" />
                <Moon className="w-5 h-5 block dark:hidden text-gray-600 dark:text-gray-300" />
            </button>
        </>
    );
};

export default ThemeToggle;
